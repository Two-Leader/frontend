import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CssBaseline, List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import axios from 'axios';
import { BASE_URL } from 'lib/BaseUrl';
import { Form, Modal } from 'react-bootstrap';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);
  const [studyRoomNameValue, setStudyRoomNameValue] = useState<string>('');
  const [showStudyRoomModal, setShowStudyRoomModal] = useState<boolean>(false);
  const handleStudyRoomModalClose = () => setShowStudyRoomModal(false);
  const handleStudyRoomModalShow = () => setShowStudyRoomModal(true);

  const studyRoomDatas = useCallback(() => {
    axios
      .get(`${BASE_URL}/studies`)
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

  const StudyRoom = () => {
    handleStudyRoomModalClose();
    axios
      .post(`${BASE_URL}/studies`, {
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
    <Box>
      <CssBaseline />
      <Box>
        <List>
          {studyRoomItems.map((studyRoomItem) => (
            <StudyRoomItem
              key={studyRoomItem.roomUuid}
              roomUuid={studyRoomItem.roomUuid}
              roomName={studyRoomItem.roomName}
            />
          ))}
        </List>
      </Box>
      <Box>
        <Button onClick={handleStudyRoomModalShow}>Create StudyRoom</Button>
        {/* ============== Modal ============== */}
        <Modal show={showStudyRoomModal} onHide={handleStudyRoomModalClose}>
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
            <Button className="btn_close" onClick={handleStudyRoomModalClose}>
              닫기
            </Button>

            <Button type="submit" onClick={StudyRoom}>
              방 생성
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ============== Modal ============== */}
      </Box>
    </Box>
  );
}
