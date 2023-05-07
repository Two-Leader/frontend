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
  const navigate = useNavigate();
  const goStudyRoom = (target: any) => {
    navigate(`/studyRoom/${target.value}`);
  };

  return (
    <ListItem>
      <Button
        type="button"
        value={roomUuid}
        onClick={(e) => {
          goStudyRoom(e.target);
        }}
      >
        {roomName}
      </Button>
    </ListItem>
  );
}
