import { v4 } from 'uuid';
import React, { useCallback, useEffect, useState } from 'react';
import { List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from '@mui/material/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);
  const [studyRoomNameValue, setStudyRoomNameValue] = useState<string>('');
  const [showCreateStudyRoomModal, setShowCreateStudyRoomModal] =
    useState<boolean>(false);
  const handleCreateStudyRoomModalClose = () =>
    setShowCreateStudyRoomModal(false);
  const handleCreateStudyRoomModalShow = () =>
    setShowCreateStudyRoomModal(true);

  const studyRoomDatas = useCallback(() => {
    axios
      .get('http://localhost:8080/api/v1/studies')
      .then((response) => {
        if (response.status === 200) {
          setStudyRoomItems(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    studyRoomDatas();
  }, [studyRoomDatas]);

  const createStudyRoom = () => {
    handleCreateStudyRoomModalClose();
    axios
      .post('http://localhost:8080/api/v1/studies', {
        roomName: studyRoomNameValue,
      })
      .then((response) => {
        if (response.status === 201) {
          studyRoomDatas();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                <Form.Control
                  type="text"
                  autoFocus
                  id="roomName"
                  onChange={(e) => setStudyRoomNameValue(e.target.value)}
                />
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

            <Button type="submit" onClick={createStudyRoom}>
              방 생성
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
