import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ListItem } from '@mui/material';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function StudyRoomItem({ roomUuid, roomName }: StudyRoomProps) {
  const [showCreateUserModal, setShowCreateUserModal] =
    useState<boolean>(false);
  const handleCreateUserModalClose = () => setShowCreateUserModal(false);
  const handleCreateUserModalShow = () => setShowCreateUserModal(true);
  const [userNameValue, setUserNameValue] = useState<string>('');

  const navigate = useNavigate();
  const goStudyRoom = () => {
    axios
      .post('http://localhost:8080/api/v1/users', {
        userName: userNameValue,
        roomUuid: `${roomUuid}`,
      })
      .then((response) => {
        if (response.status === 201) {
          sessionStorage.setItem(
            `${roomUuid}`,
            `${response.data.data.userUuid}`,
          );
          navigate(`studyRoom/${roomUuid}`);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <ListItem>
      <Button
        type="button"
        value={roomUuid}
        onClick={handleCreateUserModalShow}
      >
        {roomName}
      </Button>
      <Modal show={showCreateUserModal} onHide={handleCreateUserModalClose}>
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
          <Button className="btn_close" onClick={handleCreateUserModalClose}>
            닫기
          </Button>

          <Button type="submit" onClick={goStudyRoom}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </ListItem>
  );
}
