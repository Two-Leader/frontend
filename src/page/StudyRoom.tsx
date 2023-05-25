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
  const myWebCamRef = useRef<HTMLVideoElement>(null);
  const peerWebCamRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>({});
  const pcRef = useRef<RTCPeerConnection>();
  // const [remoteUser, setRemoteUser] = useState<boolean>(false);

  let myPeerConnection: RTCPeerConnection;
  // let myStream: MediaStream;
  let myWebCam: HTMLVideoElement;

  const navigate = useNavigate();

  useEffect(() => {
    findUseruuid();

    // socket connect
    socketRef.current = new Client({
      brokerURL: `${BASE_URL_WS}/websocket`,

      onConnect: () => {
        socketSubscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    pcRef.current = new RTCPeerConnection(peerConnectionConfig);

    socketRef.current.activate();

    axios
      .get(`${BASE_URL}/studies/${roomUuid}`)
      .then((res) => {
        if (res.data.data.checkUser) {
          createOffer();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 400) {
          alert('존재하지 않는 방입니다.');
          navigate('/');
        } else {
          alert('무슨 문제가 생김');
          console.log(err);
        }
      });

    getMedia();
    return () => {
      if (socketRef.current) {
        socketRef.current.deactivate();
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
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

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (myWebCamRef.current && stream) {
        myWebCamRef.current.srcObject = stream;
      }
      if (!(pcRef.current && socketRef.current)) {
        return;
      }
      stream.getTracks().forEach((track) => {
        if (!pcRef.current) {
          return;
        }
        pcRef.current.addTrack(track, stream);
      });
      pcRef.current.onicecandidate = handleICECandidateEvent;
      pcRef.current.ontrack = handleTrackEvent;
    } catch (err) {
      console.log(err);
    }
  };

  /* ============= WebSocket 관련 ============ */

  const socketSubscribe = () => {
    // 연결 후 구독
    socketRef.current.subscribe(`/topic/${roomUuid}`, handleWebSocketMessage);
  };

  const handleWebSocketMessage = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    if (payload && payload.from !== findUseruuid()) {
      console.log('getMessage :', payload.type);
      const handler = messageHandlers[payload.type];
      if (handler) {
        handler(payload);
      }
    }
  };

  const messageHandlers = useMemo<MessageHandlers>(
    () => ({
      offer: async (message) => {
        if (!(pcRef.current && socketRef.current)) {
          return;
        }
        try {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(message.sdp),
          );
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          console.log('sent the answer');
          socketRef.current.publish({
            destination: `/app/${roomUuid}`,
            body: JSON.stringify({
              from: findUseruuid(),
              type: 'answer',
              sdp: answer,
            }),
          });
        } catch (err) {
          console.log(err);
        }
      },
      answer: (message) => {
        try {
          if (!pcRef.current) return;
          pcRef.current.setRemoteDescription(message.sdp);
        } catch (err) {
          console.log(err);
        }
      },
      ice: (ice) => {
        if (!pcRef.current) return;
        pcRef.current.addIceCandidate(ice);
      },
    }),
    [],
  );

  /* ============= WebSocket 관련 ============ */

  /* ============= WebRTC 관련 ============ */

  const createOffer = () => {
    if (!(pcRef.current && socketRef.current)) {
      return;
    }
    pcRef.current
      .createOffer()
      .then(async (offer) => {
        if (!pcRef.current) return;
        await pcRef.current.setLocalDescription(offer);
        console.log('sent the offer');
        socketRef.current.publish({
          destination: `/app/${roomUuid}`,
          body: JSON.stringify({
            from: findUseruuid(),
            type: 'offer',
            sdp: offer,
          }),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleICECandidateEvent(event: { candidate: any }) {
    if (!(socketRef.current.connected && event.candidate)) {
      return;
    }
    console.log('sent the ice');
    socketRef.current.publish({
      from: findUseruuid(),
      type: 'ice',
      candidate: event.candidate,
    });
  }

  function handleTrackEvent(event: any) {
    if (peerWebCamRef.current) {
      console.log('success track');
      const [stream] = event.streams;
      peerWebCamRef.current.srcObject = stream;
    }
  }

  /* ============= WebRTC 관련 ============ */

  return (
    <Box>
      <CssBaseline />
      <IconButton
        onClick={() => {
          setAudioStatus(!audioStatus);
        }}
      >
        {audioStatus ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton
        onClick={() => {
          setVideoStatus(!videoStatus);
        }}
      >
        {videoStatus ? <Videocam /> : <VideocamOff />}
      </IconButton>
      <Box>
        <video id="myWebCam" autoPlay playsInline ref={myWebCamRef}>
          <track
            kind="captions"
            src="captions_en.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
      </Box>
      <Box>
        <video id="peerWebCam" autoPlay playsInline ref={peerWebCamRef}>
          <track
            kind="captions"
            src="captions_en.vtt"
            srcLang="en"
            label="English"
            default
          />
        </video>
      </Box>
    </Box>
  );
}
