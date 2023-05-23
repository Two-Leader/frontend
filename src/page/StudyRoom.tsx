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

export default function StudyRoom() {
  const roomUuid = useMatch('/studyRooms/:roomUuid')?.params.roomUuid;
  const [userUuid, setUserUuid] = useState<string>('');
  const [videoStatus, setVideoStatus] = useState<boolean>(true);
  const [audioStatus, setAudioStatus] = useState<boolean>(true);
  const webCamRef = useRef<any>();
  const client = useRef<any>({});
  // const [myPeerConnection, setMyPeerConnection] = useState<any>(null);
  const myFace = document.getElementById('myFace');
  let myPeerConnection: RTCPeerConnection;
  let myStream;

  const navigate = useNavigate();

  useEffect(() => {
    if (roomUuid) {
      findUseruuid();

      axios
        .get(`${BASE_URL}/studies/${roomUuid}`)
        .then((response) => {
          if (response.data.data.checkUser) {
            console.log('connecting different user');
          }
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert('존재하지 않는 방입니다.');
            navigate('/');
          }
        });

      connect();
    }

    return () => disconnect();
  }, []);
  // getMedia();
  makeConnection();

  const findUseruuid = () => {
    const userUuidFromSession = sessionStorage.getItem(`${roomUuid}`);
    if (userUuidFromSession) {
      setUserUuid(userUuidFromSession);
    } else {
      navigate(`/studyRooms/${roomUuid}/users`);
    }
    return userUuidFromSession;
  };

  /* ============= WebSocket 관련 ============ */
  // Socket Connect
  const connect = () => {
    // 연결할 때
    client.current = new Client({
      brokerURL: `${BASE_URL_WS}/websocket`,

      onConnect: () => {
        subscribe();
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.current.activate(); // 클라이언트 활성화
  };

  const disconnect = () => {
    // 연결이 끊겼을 때
    client.current.deactivate();
  };

  const subscribe = () => {
    // 연결 후 구독
    client.current.subscribe(`/topic/${roomUuid}`, handleWebSocketMessage);
  };

  const handleWebSocketMessage = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    if (payload && payload.from !== findUseruuid()) {
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
      },
    }),
    [],
  );

  const handleNegotiationNeededEvent = () => {
    console.log(myPeerConnection);
    if (!client.current.connected) {
      return;
    }
    myPeerConnection
      .createOffer()
      .then(() => {
        client.current.publish({
          destination: `/app/${roomUuid}/offer`,
          body: JSON.stringify({
            from: userUuid,
            type: 'offer',
            sdp: myPeerConnection.localDescription,
          }),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  /* ============= WebSocket 관련 ============ */

  /* ============= WebRTC 관련 ============ */

  // async function getMedia() {
  //   try {
  //     myStream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: true,
  //     });
  //     // console.log(myStream);
  //     if(myFace){
  //       myFace.srcObject = myStream;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  function makeConnection() {
    myPeerConnection = new RTCPeerConnection();
    if (webCamRef.current && webCamRef.current.unmounted === false) {
      webCamRef.current.stream
        .getTracks()
        .forEach((track: MediaStreamTrack) =>
          myPeerConnection.addTrack(track, webCamRef.current.stream),
        );
    }
  }
  /* ============= WebRTC 관련 ============ */

  return (
    <Box>
      <CssBaseline />
      <Button onClick={handleNegotiationNeededEvent} />
      <IconButton
        onClick={() => {
          webCamRef.current.stream
            .getAudioTracks()
            .forEach((track: { enabled: boolean }) => {
              // eslint-disable-next-line no-param-reassign
              track.enabled = !track.enabled;
              setAudioStatus(!audioStatus);
            });
        }}
      >
        {audioStatus ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton
        onClick={() => {
          webCamRef.current.stream
            .getVideoTracks()
            .forEach((track: { enabled: boolean }) => {
              // eslint-disable-next-line no-param-reassign
              track.enabled = !track.enabled;
              setVideoStatus(!videoStatus);
            });
        }}
      >
        {videoStatus ? <Videocam /> : <VideocamOff />}
      </IconButton>
      <Box>
        <Webcam
          id="myFace"
          mirrored
          audio
          ref={webCamRef}
          videoConstraints={videoConstraints}
        />
        {/* <video id="myFace" autoPlay playsInline /> */}
      </Box>
    </Box>
  );
}
