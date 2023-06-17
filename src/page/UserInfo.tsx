import { Box, Button, CssBaseline, TextField } from '@mui/material';
import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';

import { useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

export default function UserInfo() {
  const [userNameValue, setUserNameValue] = useState<string>('');
  const roomUuid = useMatch('/studyRooms/:roomUuid/users')?.params.roomUuid;
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem(`${roomUuid}`)) {
      navigate(`/studyRooms/${roomUuid}`);
    }
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
          sessionStorage.setItem(
            `${roomUuid}`,
            `${response.data.data.userUuid}`,
          );
          navigate(`/studyRooms/${roomUuid}`);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Box>
      <CssBaseline />
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
