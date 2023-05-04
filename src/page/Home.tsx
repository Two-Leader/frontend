import { v4 } from 'uuid';
import React, { useState } from 'react';
import { List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([
    {
      roomUuid: v4(),
      roomName: 'room1',
    },
    {
      roomUuid: v4(),
      roomName: 'room2',
    },
    {
      roomUuid: v4(),
      roomName: 'room3',
    },
  ]);

  const [showCreateStudyRoomModal, setShowCreateStudyRoomModal] =
    useState<boolean>(false);
  const handleCreateStudyRoomModalClose = () =>
    setShowCreateStudyRoomModal(false);
  const handleCreateStudyRoomModalShow = () =>
    setShowCreateStudyRoomModal(true);

  const [showCreateUserModal, setShowCreateUserModal] =
    useState<boolean>(false);
  const handleCreateUserModalClose = () => setShowCreateUserModal(false);
  const handleCreateUserModalShow = () => setShowCreateUserModal(true);

  return (
    <div className="Home-wrap">
      <div className="studyRoomContainer">
        <List>
          {studyRoomItems.map((studyRoomItem) => (
            <StudyRoomItem
              key={studyRoomItem.roomUuid}
              roomUuid={studyRoomItem.roomUuid}
              roomName={studyRoomItem.roomName}
              handleCreateUserModalShow={handleCreateUserModalShow}
            />
          ))}
          <Modal show={showCreateUserModal} onHide={handleCreateUserModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Enter User Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>이름</Form.Label>
                  <Form.Control type="text" autoFocus id="userName" />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="btn_close"
                onClick={handleCreateUserModalClose}
              >
                닫기
              </Button>

              <Button type="submit" onClick={handleCreateUserModalClose}>
                확인
              </Button>
            </Modal.Footer>
          </Modal>
        </List>
      </div>
      <div className="studyRoomCreate">
        <Button onClick={handleCreateStudyRoomModalShow}>
          Create StudyRoom
        </Button>
        <Modal
          show={showCreateStudyRoomModal}
          onHide={handleCreateStudyRoomModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter studyRoom Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>방 이름</Form.Label>
                <Form.Control type="text" autoFocus id="roomName" />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="btn_close"
              onClick={handleCreateStudyRoomModalClose}
            >
              닫기
            </Button>

            <Button type="submit" onClick={handleCreateStudyRoomModalClose}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
