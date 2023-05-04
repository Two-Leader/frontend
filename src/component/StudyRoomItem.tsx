import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ListItem } from '@mui/material';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
  handleCreateUserModalShow: any;
}

export default function StudyRoomItem({
  roomUuid,
  roomName,
  handleCreateUserModalShow,
}: StudyRoomProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  return (
    <ListItem>
      <Button
        type="button"
        value={roomUuid}
        onClick={handleCreateUserModalShow}
      >
        {roomName}
      </Button>
    </ListItem>
  );
}
