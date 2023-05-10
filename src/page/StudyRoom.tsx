import CssBaseline from '@mui/material/CssBaseline';
import Webcam from 'react-webcam';
import { Box } from '@mui/material';
import { Button, Form, Modal } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useMatch } from 'react-router-dom';
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { BASE_URL, BASE_URL_WS } from 'lib/BaseUrl';

export default function StudyRoom() {
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [userNameValue, setUserNameValue] = useState<string>('');
  const roomUuid = useMatch('/studyRoom/:roomUuid')?.params.roomUuid;
  const client = useRef<any>({});

  useEffect(() => {
    if (roomUuid) {
      if (sessionStorage.getItem(`${roomUuid}`) === null) {
        setShowUserModal(true);
      }
      connect();
    }
    return () => disconnect();
  }, []);

  // Socket Connect
  const connect = () => {
    // 연결할 때
    client.current = new StompJs.Client({
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
    client.current.subscribe(
      `/topic/${roomUuid}`,
      (response: { body: string }) => {
        const jsonBody = JSON.parse(response.body);
        console.log(jsonBody);
      },
    );
  };

  const publish = () => {
    if (!client.current.connected) {
      return;
    }
    // 메시지 보내기
    client.current.publish({
      destination: `/app/${roomUuid}`,
      body: JSON.stringify({
        type: 'hi',
      }),
    });
  };

  // User Modal
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

          setShowUserModal(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Box>
      <CssBaseline />
      <Button onClick={publish} />
      <Box>
        <Webcam />
      </Box>
      <Box>
        <Webcam />
      </Box>
      {/* ============== Modal ============== */}
      <Modal show={showUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enter User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                id="userName"
                onChange={(e) => setUserNameValue(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" onClick={createUser}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ============== Modal ============== */}
    </Box>
  );
}
// <!DOCTYPE html>
// <html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org">
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <title>Chat Room</title>
//     <!-- Latest minified Bootstrap & JQuery-->
//     <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css">
//     <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
//     <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js"></script>
//     <!-- Custom styles for this template -->
//     <style>
//         .btn.active {
//             display: none;
//         }

//         .btn span:nth-of-type(1)  {
//             display: none;
//         }
//         .btn span:last-child  {
//             display: block;
//         }

//         .btn.active span:nth-of-type(1)  {
//             display: block;
//         }
//         .btn.active span:last-child  {
//             display: none;
//         }
//     </style>
//     <link rel="stylesheet" type="text/css" href="/css/main.css"/>
// </head>
// <body class="text-center">

// <!-- Begin page content -->
// <main role="main" class="container-fluid">
//     <h1>Simple WebRTC Signalling Server</h1>
//     <input type="hidden" id="room_uuid" name="room_uuid" th:value="${studyRoom.room_uuid}"/>
//     <input type="hidden" id="has_user" name="has_user" th:value="${studyRoom.hasUser}"/>
//     <input type="hidden" id="user_uuid" name="user_uuid" th:value="${user.user_uuid}"/>
//     <Box class="col-lg-12 mb-3">
//         <Box class="mb-3" th:text="'User: ' + ${user.user_name} + ' @ Room #' + ${studyRoom.room_name}">
//             Local User Id
//         </Box>
//         <Box class="col-lg-12 mb-3">
//             <Box class="d-flex justify-content-around mb-3">
//                 <Box id="buttons" class="row">
//                     <Box class="btn-group mr-2" role="group">
//                         <Box class="mr-2" data-toggle="buttons">
//                             <label class="btn btn-outline-success" id="video_off">
//                                 <input type="radio" name="options" style="display:none" autocomplete="off">Video On
//                             </label>
//                             <label class="btn btn-outline-warning active" id="video_on">
//                                 <input type="radio" name="options" style="display:none" autocomplete="off" checked>Video Off
//                             </label>
//                         </Box>
//                         <Box class="mr-2" data-toggle="buttons">
//                             <label class="btn btn-outline-success" id="audio_off">
//                                 <input type="radio" name="options" style="display:none" autocomplete="off">Audio On
//                             </label>
//                             <label class="btn btn-outline-warning active" id="audio_on">
//                                 <input type="radio" name="options" style="display:none" autocomplete="off" checked>Audio Off
//                             </label>
//                         </Box>
//                     </Box>

//                     <!--<button type="button" class="btn btn-outline-success" id="audio" data-toggle="button">Audio</button>-->
//                     <a th:href="@{/room/{id}/user/{uuid}/exit(id=${user.user_uuid},uuid=${studyRoom.room_uuid})}">
//                         <button type="button" class="btn btn-outline-danger" id="exit" name="exit">
//                             Exit Room
//                         </button>
//                     </a>
//                 </Box>
//             </Box>
//         </Box>

//         <Box class="row justify-content-around mb-3">
//             <Box class="col-lg-6 mb-3">
//                 <video id="local_video" autoplay playsinline></video>
//             </Box>
//             <Box class="col-lg-6 mb-3">
//                 <video id="remote_video" autoplay playsinline></video>
//             </Box>
//         </Box>
//     </Box>
// </main>

// <script src="/js/webrtc_client.js"></script>
// </body>
// </html>
