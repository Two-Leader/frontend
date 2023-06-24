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
import PublisherWebCamItem from 'component/PublisherWebCamItem';

type MessageHandler = (payload: any) => void;
type MessageHandlers = Record<string, MessageHandler>;
interface Message {
  userId: string | null;
  userName: string | null;
  message: string | null;
}

export default function StudyRoom() {
  const [webCamStatus, setWebCamStatus] = useState<boolean>(true);
  const [micStatus, setMicStatus] = useState<boolean>(true);
  const roomUuid = useMatch('/studyRooms/:roomUuid')!.params.roomUuid as string;
  const { userId, userName } = JSON.parse(
    sessionStorage.getItem(`${roomUuid}`)!,
  );

  const { publisher, streamList, onChangeCameraStatus, onChangeMicStatus } =
    useOpenvidu(userId, userName, roomUuid);

  const { stompClient, connected } = useWebSocket({
    onConnect(frame, client) {
      client.subscribe(`/topic/${roomUuid}`, function (message) {
        handleWebSocketMessage(message);
      });

      client.publish({
        destination: `/app/join/${userId}`,
      });
    },
  });

  const pickUserStreamManager = useMemo(
    () => streamList.find((it) => it.streamManager !== publisher),
    [publisher, streamList],
  );

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/studies/${roomUuid}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert('해당 스터디방은 없는 방입니다. 다시 확인부탁드립니다.');
        navigate('/');
      });
    if (!sessionStorage.getItem(`${roomUuid}`)) {
      alert('로그인이 되어있지 않습니다. 로그인 후 이용바랍니다.');
      navigate(`/studyRooms/${roomUuid}/users`);
    }
  }, []);

  /* ============= WebSocket 관련 ============ */

  const handleWebSocketMessage = (message: IMessage) => {
    const payload = JSON.parse(message.body);
    if (payload) {
      console.log('getMessage :', payload);
      const handler = messageHandlers[payload.code];
      if (handler) {
        handler(payload.data);
      }
    }
  };

  const messageHandlers = useMemo<MessageHandlers>(
    () => ({
      WEBSOCKET_SUCCESS_GET_MESSAGE: (message) => {
        console.log(message);
      },
    }),
    [],
  );

  function sendMessage(path: string, message: Message) {
    const jsonMessage = JSON.stringify(message);
    console.log('SEND message', path, jsonMessage);
    if (stompClient.current) {
      stompClient.current.publish({
        destination: `/app/${path}/${roomUuid}`,
        body: jsonMessage,
      });
    }
  }

  /* ============= WebSocket 관련 ============ */

  const btnClick = () => {
    stompClient.current?.deactivate();
  };

  return (
    <Box>
      <CssBaseline />
      <Button onClick={btnClick} />
      <Box>
        {publisher && (
          <PublisherWebCamItem streamManager={publisher.stream.streamManager} />
        )}
      </Box>
      <Box>
        {publisher &&
          streamList.map((stream, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <WebCamItem
              key={stream.userId}
              streamManager={stream.streamManager}
              name={stream.userName}
            />
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
