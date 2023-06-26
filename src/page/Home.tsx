import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, CssBaseline, List } from '@mui/material';
import StudyRoomItem from 'component/StudyRoomItem';
import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
import { BASE_URL } from 'hooks/BaseUrl';
import StudyRoomModal from 'component/StudyRoomModal';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function Home() {
  const [studyRoomItems, setStudyRoomItems] = useState<StudyRoomProps[]>([]);

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
        <StudyRoomModal
          showStudyRoomModal={showStudyRoomModal}
          handleStudyRoomModalClose={handleStudyRoomModalClose}
          studyRoomDatas={studyRoomDatas}
        />
        {/* ============== Modal ============== */}
      </Box>
    </Box>
  );
}
