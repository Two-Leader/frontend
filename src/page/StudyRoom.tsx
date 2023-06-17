import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useMatch, useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BASE_URL } from 'hooks/BaseUrl';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import Webcam from 'react-webcam';
import { useOpenvidu } from 'hooks/UseOpenVidu';
import { useWebSocket } from 'hooks/useWebSocket';
import { StreamManager } from 'openvidu-browser';
import WebCamItem from 'component/WebCamItem';

type MessageHandler = (payload: any) => void;
type MessageHandlers = Record<string, MessageHandler>;

export default function StudyRoom() {
  const [webCamStatus, setWebCamStatus] = useState<boolean>(true);
  const [micStatus, setMicStatus] = useState<boolean>(true);
  const [roomUuid, setRoomUuid] = useState<string>(
    useMatch('/studyRooms/:roomUuid')!.params.roomUuid!,
  );
  const [userUuid, setUserUuid] = useState<string>(
    sessionStorage.getItem(`${roomUuid}`)!,
  );
  const socketRef = useRef<any>({});

  const { publisher, streamList, onChangeCameraStatus, onChangeMicStatus } =
    useOpenvidu(userUuid, roomUuid);
  const pickUserStreamManager = useMemo(
    () => streamList.find((it) => it.streamManager !== publisher),
    [publisher, streamList],
  );

  const navigate = useNavigate();

  useWebSocket({
    onConnect(frame, client) {
      client.subscribe(`/topic/${roomUuid}`, function (message) {
        handleWebSocketMessage(message);
      });
    },
    beforeDisconnected(frame, client) {
      sendMessage('', 'leave');
    },
  });

  const findUseruuid = () => {
    const userUuidFromSession = sessionStorage.getItem(`${roomUuid}`);
    if (!userUuidFromSession) {
      return navigate(`/studyRooms/${roomUuid}/users`);
    }
    return userUuidFromSession;
  };

  /* ============= WebSocket 관련 ============ */

  const handleWebSocketMessage = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    if (payload && payload.from !== findUseruuid()) {
      console.log('getMessage :', payload.code);
      const handler = messageHandlers[payload.code];
      if (handler) {
        handler(payload);
      }
    }
  };

  const messageHandlers = useMemo<MessageHandlers>(
    () => ({
      WEBRTC_SUCCESS_ADDED_STUDYROOM_USER: (message) => {
        console.log(message);
      },
      WEBRTC_SUCCESS_GET_STUDYROOM_USERS: (message) => {
        console.log(message);
      },
    }),
    [],
  );

  function sendMessage(message: string | null, path: string) {
    const jsonMessage = JSON.stringify(message);
    console.log('SEND message', path, jsonMessage);
    socketRef.current.publish({
      destination: `/app/${path}/${roomUuid}`,
      body: jsonMessage,
    });
  }
  /* ============= WebSocket 관련 ============ */

  return (
    <Box>
      <CssBaseline />
      <Box>
        {publisher &&
          streamList.map((stream, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <WebCamItem key={idx} streamManager={stream.streamManager} />
          ))}
      </Box>
      <Box>
        <IconButton
          onClick={() => {
            onChangeMicStatus(!micStatus);
            setMicStatus(!micStatus);
          }}
        >
          {micStatus ? <Mic /> : <MicOff />}
        </IconButton>
        <IconButton
          onClick={() => {
            onChangeCameraStatus(!webCamStatus);
            setWebCamStatus(!webCamStatus);
          }}
        >
          {webCamStatus ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Box>
    </Box>
  );
}
