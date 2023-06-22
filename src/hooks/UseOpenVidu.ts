import { OpenVidu } from 'openvidu-browser';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getToken } from './OpenviduApi';

interface subscribeInterface {
  streamManager: any;
  userUuid: string;
  userName: string | null;
}

export const useOpenvidu = (
  userUuid: string,
  userName: string,
  roomUuid: string,
) => {
  const [subscribers, setSubscribers] = useState<subscribeInterface[]>([]);
  const [publisher, setPublisher] = useState<any>();
  const [session, setSession] = useState<any>();

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect();
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
  }, [session]);

  useEffect(() => {
    const openVidu = new OpenVidu();
    const session = openVidu.initSession();

    session.on('streamCreated', (event) => {
      const subscriber = session.subscribe(event.stream, '');
      const data = JSON.parse(event.stream.connection.data);
      setSubscribers((prev) => {
        return [
          ...prev.filter((it) => it.userUuid !== data.userUuid),
          {
            streamManager: subscriber,
            userUuid: data.userUuid,
            userName: data.userName,
          },
        ];
      });
    });

    session.on('streamDestroyed', (event) => {
      event.preventDefault();

      const data = JSON.parse(event.stream.connection.data);
      setSubscribers((prev) =>
        prev.filter((it) => it.userUuid !== data.userUuid),
      );
    });

    session.on('exception', (exception) => {
      console.warn(exception);
    });

    getToken(roomUuid).then((token) => {
      session!
        .connect(token, JSON.stringify({ userUuid, userName }))
        .then(async () => {
          const devices = await openVidu.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput',
          );

          const publisher = openVidu.initPublisher('', {
            audioSource: undefined,
            videoSource: videoDevices[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: true,
          });

          setPublisher(publisher);
          session.publish(publisher);
        })
        .catch((error) => {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message,
          );
        });
    });

    setSession(session);
    return () => {
      if (session) {
        session.disconnect();
      }
      setSession(null);
      setPublisher(null);
      setSubscribers([]);
    };
  }, [roomUuid, userUuid]);

  useEffect(() => {
    window.addEventListener('beforeunload', () => leaveSession());
    return () => {
      window.removeEventListener('beforeunload', () => leaveSession());
    };
  }, [leaveSession]);

  const onChangeCameraStatus = useCallback(
    (status: boolean) => {
      publisher?.publishVideo(status);
    },
    [publisher],
  );

  const onChangeMicStatus = useCallback(
    (status: boolean) => {
      publisher?.publishAudio(status);
    },
    [publisher],
  );

  const streamList = useMemo(() => [...subscribers], [subscribers]);

  return {
    publisher,
    streamList,
    onChangeCameraStatus,
    onChangeMicStatus,
  };
};
