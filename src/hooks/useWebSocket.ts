import { useEffect, useRef, useState } from 'react';
import * as Stomp from '@stomp/stompjs';
import { WS_BASE_URL } from './BaseUrl';

interface Param {
  onConnect: (frame: Stomp.Frame, client: Stomp.Client) => void;
  reconnectDelay?: number;
}

export const useWebSocket = (param: Param) => {
  const [connected, setConnected] = useState<boolean>(false);
  const stompClient = useRef<Stomp.Client>();

  useEffect(() => {
    const config: Stomp.StompConfig = {
      brokerURL: `${WS_BASE_URL}/websocket`,
      reconnectDelay: param.reconnectDelay ? param.reconnectDelay : 5000,
      onConnect: (frame) => {
        console.log('소켓 연결 성공!!', frame);
        setConnected(true);
        param.onConnect(frame, stompClient.current!);
      },
      logRawCommunication: false,
    };
    stompClient.current = new Stomp.Client(config);
    stompClient.current.activate();

    return () => {
      stompClient.current?.deactivate();
    };
  }, []);

  return { stompClient, connected };
};
