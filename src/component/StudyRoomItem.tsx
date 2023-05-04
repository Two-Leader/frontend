import { v4 } from 'uuid';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { ListItem } from '@mui/material';

interface StudyRoomProps {
  roomUuid: string;
  roomName: string;
}

export default function StudyRoomItem({ roomUuid, roomName }: StudyRoomProps) {
  return (
    <ListItem>
      <Button type="button" value={roomUuid}>
        {roomName}
      </Button>
    </ListItem>
  );
}
