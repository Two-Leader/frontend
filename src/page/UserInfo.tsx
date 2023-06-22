import { Mic, MicOff, Videocam, VideocamOff } from '@mui/icons-material';
import { Box, Button, CssBaseline, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import { useEffect, useRef, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { RecoilState } from 'recoil';
import { WebCamStatus } from 'store/WebCamStatus';

export default function UserInfo() {
  const [userNameValue, setUserNameValue] = useState<string>('');
  const roomUuid = useMatch('/studyRooms/:roomUuid/users')?.params.roomUuid;
  const webCamRef = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(`${roomUuid}`)) {
      navigate(`/studyRooms/${roomUuid}`);
    }
    if (webCamRef) console.log(webCamRef);
  });

  const createUser = () => {
    if (userNameValue === '') {
      alert('사용자이름을 작성하지 않았습니다.');
      return;
    }
    axios
      .post(`${BASE_URL}/users`, {
        userName: userNameValue,
        roomUuid: `${roomUuid}`,
      })
      .then((response) => {
        if (response.status === 201) {
          const data = {
            userUuid: response.data.data.userUuid,
            userName: response.data.data.userName,
          };
          sessionStorage.setItem(`${roomUuid}`, JSON.stringify(data));
          navigate(`/studyRooms/${roomUuid}`);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // const onChangeCameraStatus = () => {
  //   setWebCamStatus(!webCamStatus);
  // };

  return (
    <Box>
      <CssBaseline />
      {/* <Webcam ref={webCamRef} mirrored audio={micStatus} />

      <Box>
        <IconButton
          onClick={() => {
            // setMicStatus(!micStatus);
          }}
        >
          {micStatus ? <Mic /> : <MicOff />}
        </IconButton>
        <IconButton onClick={onChangeCameraStatus}>
          {webCamStatus ? <Videocam /> : <VideocamOff />}
        </IconButton>
      </Box> */}
      <TextField
        label="User Name"
        variant="standard"
        onChange={(e) => setUserNameValue(e.target.value)}
      />
      <Button variant="contained" onClick={createUser}>
        Join
      </Button>
    </Box>
  );
}
function useRecoilState(WebCamStatus: RecoilState<boolean[]>) {
  throw new Error('Function not implemented.');
}
