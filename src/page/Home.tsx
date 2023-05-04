import { v4 } from 'uuid';
import React, { useState } from 'react';
import { List, ListItem } from '@mui/material';
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

  const [showModal, setShowModal] = useState<boolean>(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <div className="Home-wrap">
      <div className="studyRoomContainer">
        <List>
          {studyRoomItems.map((studyRoomItem) => (
            <StudyRoomItem
              key={studyRoomItem.roomUuid}
              roomUuid={studyRoomItem.roomUuid}
              roomName={studyRoomItem.roomName}
            />
          ))}
        </List>
      </div>
      <div className="studyRoomCreate">
        <Button onClick={handleModalShow}>Create StudyRoom</Button>
        <Modal show={showModal} onHide={handleModalClose}>
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
            <Button className="btn_close" onClick={handleModalClose}>
              닫기
            </Button>

            <Button type="submit" onClick={handleModalClose}>
              확인
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
