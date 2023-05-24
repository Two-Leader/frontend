import CssBaseline from '@mui/material/CssBaseline';
import Webcam from 'react-webcam';
import { Box, Button, IconButton } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Await, useMatch, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BASE_URL, BASE_URL_WS } from 'lib/BaseUrl';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';

interface webSocketMessage {
  from: string;
  type: string;
  candidate: any;
  sdp: any;
}

type MessageHandler = (payload: webSocketMessage) => void;
type MessageHandlers = Record<string, MessageHandler>;

const videoConstraints = {
  facingMode: 'user',
};

const peerConnectionConfig = {
  iceServers: [
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export default function StudyRoom() {
  const roomUuid = useMatch('/studyRooms/:roomUuid')?.params.roomUuid;
  const [userUuid, setUserUuid] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<boolean>(true);
  const [audioStatus, setAudioStatus] = useState<boolean>(true);
  const webCamRef = useRef<any>();
  const peerWebCamRef = useRef<any>();
  const client = useRef<any>({});
  // const [remoteUser, setRemoteUser] = useState<boolean>(false);

  let myPeerConnection: RTCPeerConnection;
  let myStream: MediaStream;
  let myWebCam: HTMLVideoElement;

  const navigate = useNavigate();

  useEffect(() => {
    if (roomUuid) {
      findUseruuid();

      axios.get(`${BASE_URL}/studies/${roomUuid}`).catch((err) => {
        if (err.response.status === 400) {
          alert('존재하지 않는 방입니다.');
          navigate('/');
        }
      });
    }
    myWebCam = document.getElementById('myWebCam') as HTMLVideoElement;
    getMedia();
    socketConnect();

    return () => socketDisconnect();
  }, []);

  const onUserMedia = useCallback(() => {
    createPeerConnection();
  }, []);

  const findUseruuid = () => {
    const userUuidFromSession = sessionStorage.getItem(`${roomUuid}`);
    if (userUuidFromSession) {
      setUserUuid(userUuidFromSession);
    } else {
      navigate(`/studyRooms/${roomUuid}/users`);
    }
    return userUuidFromSession;
  };

  async function getMedia() {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (myWebCam && myStream) {
        myWebCam.srcObject = myStream;
        await createPeerConnection();
      }
    } catch (err) {
      console.log(err);
    }
  }

  /* ============= WebSocket 관련 ============ */
  // Socket Connect
  const socketConnect = () => {
    // 연결할 때
    client.current = new Client({
      brokerURL: `${BASE_URL_WS}/websocket`,

      onConnect: () => {
        socketSubscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate(); // 클라이언트 활성화
  };

  const socketDisconnect = () => {
    // 연결이 끊겼을 때
    client.current.deactivate();
  };

  const socketSubscribe = () => {
    // 연결 후 구독
    client.current.subscribe(`/topic/${roomUuid}`, handleWebSocketMessage);
  };

  const handleWebSocketMessage = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    if (payload && payload.from !== findUseruuid()) {
      console.log('sucess', payload.type);
      const handler = messageHandlers[payload.type];
      if (handler) {
        handler(payload);
      }
    }
  };

  const messageHandlers = useMemo<MessageHandlers>(
    () => ({
      offer: (message) => {
        console.log(message);
        if (message.sdp) {
          try {
            console.log(myPeerConnection);
            myPeerConnection
              .setRemoteDescription(new RTCSessionDescription(message.sdp))
              .then(() => {
                return myPeerConnection.createAnswer();
              })
              .then((answer) => {
                return myPeerConnection.setLocalDescription(answer);
              })
              .then(() => {
                client.current.publish({
                  destination: `/app/${roomUuid}/offer`,
                  body: JSON.stringify({
                    from: findUseruuid(),
                    type: 'answer',
                    sdp: myPeerConnection.localDescription,
                  }),
                });
              });
          } catch (err) {
            console.log(err);
          }
        }
      },
      answer: (message) => {
        console.log(myPeerConnection, message);
        console.log(peerWebCamRef.current.srcObject);
        console.log(webCamRef.current.srcObject);
        try {
          myPeerConnection.setRemoteDescription(
            new RTCSessionDescription(message.sdp),
          );
        } catch (err) {
          console.log(err);
        }
      },
      ice: (ice) => {
        console.log(ice);
        myPeerConnection.addIceCandidate(ice);
      },
    }),
    [],
  );

  /* ============= WebSocket 관련 ============ */

  /* ============= WebRTC 관련 ============ */

  const createPeerConnection = () => {
    if (myStream) {
      myPeerConnection = new RTCPeerConnection(peerConnectionConfig);
      myPeerConnection.onicecandidate = handleICECandidateEvent;
      myPeerConnection.ontrack = handleTrackEvent;
      myStream
        .getTracks()
        .forEach((track: MediaStreamTrack) =>
          myPeerConnection.addTrack(track, myStream),
        );
      handleNegotiationNeededEvent();
    }
  };

  function handleNegotiationNeededEvent() {
    if (client.current.connected && myPeerConnection) {
      myPeerConnection
        .createOffer()
        .then((offer) => {
          return myPeerConnection.setLocalDescription(offer);
        })
        .then(() => {
          client.current.publish({
            destination: `/app/${roomUuid}/offer`,
            body: JSON.stringify({
              from: findUseruuid(),
              type: 'offer',
              sdp: myPeerConnection.localDescription,
            }),
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleICECandidateEvent(event: { candidate: any }) {
    if (client.current.connected && event.candidate) {
      client.current.publish({
        from: findUseruuid(),
        type: 'ice',
        candidate: event.candidate,
      });
    }
  }

  function handleTrackEvent(event: any) {
    const [stream] = event.streams;
    const peerWebCam = document.getElementById(
      'remoteUser',
    ) as HTMLVideoElement;
    peerWebCam.srcObject = stream;

    // console.log(peerWebCam);
  }

  /* ============= WebRTC 관련 ============ */

  return (
    <Box>
      <CssBaseline />
      <IconButton
        onClick={() => {
          myStream.getAudioTracks().forEach((track: { enabled: boolean }) => {
            // eslint-disable-next-line no-param-reassign
            track.enabled = !track.enabled;
            setAudioStatus(!audioStatus);
          });
          console.log(myStream.getAudioTracks());
        }}
      >
        {audioStatus ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton
        onClick={() => {
          myStream.getVideoTracks().forEach((track: { enabled: boolean }) => {
            // eslint-disable-next-line no-param-reassign
            track.enabled = !track.enabled;
            setVideoStatus(!videoStatus);
          });
          console.log(myStream.getVideoTracks());
        }}
      >
        {videoStatus ? <Videocam /> : <VideocamOff />}
      </IconButton>
      <Box>
        <video id="myWebCam" autoPlay playsInline ref={webCamRef}>
          <track
            kind="captions"
            src="captions_en.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
        {/* <Webcam
          mirrored
          audio
          ref={webCamRef}
          onUserMedia={onUserMedia}
          videoConstraints={videoConstraints}
        /> */}
      </Box>
      <video id="remoteUser" autoPlay playsInline ref={peerWebCamRef}>
        <track
          kind="captions"
          src="captions_en.vtt"
          srcLang="en"
          label="English"
          default
        />
      </video>
    </Box>
  );
}
