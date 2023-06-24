import axios from 'axios';
import { BASE_URL } from 'hooks/BaseUrl';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface LoginProps {
  showStudyRoomModal: boolean;
  handleStudyRoomModalClose: any;
  studyRoomDatas: any;
}

export default function StudyRoomModal({
  showStudyRoomModal,
  handleStudyRoomModalClose,
  studyRoomDatas,
}: LoginProps) {
  const [studyRoomNameValue, setStudyRoomNameValue] = useState<string>('');

  const StudyRoom = () => {
    handleStudyRoomModalClose();
    console.log(sessionStorage.getItem('token'));
    axios
      .post(`${BASE_URL}/studies`, {
        roomName: studyRoomNameValue,
        userUuid: sessionStorage.getItem('token'),
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
  );
}
