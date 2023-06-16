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
import { BASE_URL, BASE_URL_WS } from 'lib/BaseUrl';
import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import Webcam from 'react-webcam';

interface webSocketMessage {
  from: string;
  code: string;
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
  const myWebCamRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    const myUuid = findUseruuid();

    // socket connect
    socketRef.current = new Client({
      brokerURL: `${BASE_URL_WS}/websocket`,

      onConnect: () => {
        // 연결 후 구독
        socketRef.current.subscribe(`/topic/${myUuid}`, handleWebSocketMessage);
      },
      onStompError: (frame) => {
        console.error(frame);
      },
    });

    socketRef.current.activate();

    return () => {
      if (socketRef.current) {
        socketRef.current.deactivate();
      }
    };
  }, []);

  const findUseruuid = () => {
    const userUuidFromSession = sessionStorage.getItem(`${roomUuid}`);
    if (!userUuidFromSession) {
      navigate(`/studyRooms/${roomUuid}/users`);
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

  /* ============= WebRTC 관련 ============ */

  /* ============= WebRTC 관련 ============ */

  return (
    <Box>
      <CssBaseline />
      <Box>
        <Webcam />
      </Box>
    </Box>
  );
}
