import CssBaseline from '@mui/material/CssBaseline';
import Webcam from 'react-webcam';
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
  const [videoStatus, setVideoStatus] = useState<boolean>(true);
  const [audioStatus, setAudioStatus] = useState<boolean>(true);
  const myWebCamRef = useRef<HTMLVideoElement>(null);
  const peerWebCamRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>({});
  const pcRef = useRef<RTCPeerConnection>();
  const [videos, setVideos] = useState<any>([]);
  const [audios, setAudios] = useState<any>([]);

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
    if (!userUuidFromSession) {
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
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        if (!(pcRef.current && stream)) {
          return;
        }
        pcRef.current.addTrack(track, stream);
      });
      pcRef.current.onicecandidate = handleICECandidateEvent;
      pcRef.current.ontrack = handleTrackEvent;

      await getCameras();
      await getAudios();
    } catch (err) {
      console.log(err);
    }
  };

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === 'videoinput');
      setVideos(cameras);
    } catch (err) {
      console.log(err);
    }
  };

  const getAudios = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audios = devices.filter((device) => device.kind === 'audioinput');
      setAudios(audios);
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
          const offer = new RTCSessionDescription(message.sdp);
          await pcRef.current.setRemoteDescription(offer);
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          console.log('sent the answer');
          socketRef.current.publish({
            destination: `/app/${roomUuid}/webRTC`,
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
          const answer = new RTCSessionDescription(message.sdp);
          pcRef.current.setRemoteDescription(answer);
        } catch (err) {
          console.log(err);
        }
      },
      ice: (ice) => {
        if (!pcRef.current) return;
        pcRef.current.addIceCandidate(new RTCIceCandidate(ice.candidate));
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
          destination: `/app/${roomUuid}/webRTC`,
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
      destination: `/app/${roomUuid}/webRTC`,
      body: JSON.stringify({
        from: findUseruuid(),
        type: 'ice',
        candidate: event.candidate,
      }),
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
          if (!myWebCamRef.current) return;
          const stream = myWebCamRef.current.srcObject as MediaStream;
          stream.getAudioTracks().forEach((track: MediaStreamTrack) => {
            // eslint-disable-next-line no-param-reassign
            track.enabled = !track.enabled;
          });
          setAudioStatus(!audioStatus);
        }}
      >
        {audioStatus ? <Mic /> : <MicOff />}
      </IconButton>
      <IconButton
        onClick={() => {
          if (!myWebCamRef.current) return;
          const stream = myWebCamRef.current.srcObject as MediaStream;
          stream.getVideoTracks().forEach((track: MediaStreamTrack) => {
            // eslint-disable-next-line no-param-reassign
            track.enabled = !track.enabled;
          });
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
        <Box>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Video</InputLabel>
            <Select>
              {videos.map((video: any) => (
                <MenuItem key={video.key}>{video.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Audio</InputLabel>
            <Select>
              {audios.map((audio: any) => (
                <MenuItem key={audio.key}>{audio.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
