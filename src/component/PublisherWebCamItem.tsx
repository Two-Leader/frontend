import React, { useRef, useEffect } from 'react';
import { StreamManager } from 'openvidu-browser';
import { Box } from '@mui/material';
import { useStream } from 'hooks/useStream';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import MicOffIcon from '@mui/icons-material/MicOff';

interface WebcamItemProps {
  streamManager: StreamManager;
}

export default function PublisherWebCamItem({
  streamManager,
}: WebcamItemProps) {
  const { videoRef, speaking, micStatus, videoStatus } =
    useStream(streamManager);

  function getNicknameTag(): string {
    return JSON.parse(streamManager.stream.connection.data).userUuid;
  }
  return (
    <div>
      <video id="myWebCam" ref={videoRef}>
        <track
          kind="captions"
          src="captions_en.vtt"
          srcLang="en"
          label="English"
          default
        />
      </video>
    </div>
  );
}
