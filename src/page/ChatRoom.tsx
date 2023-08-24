import React, { useEffect, useState } from 'react';
import { useWebSocket } from 'hooks/useWebSocket';

interface Message {
  userId: string | null;
  userName: string | null;
  message: string | null;
}

export default function ChatRoom() {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { stompClient, connected } = useWebSocket({
    onConnect: (frame, client) => {
      // 서버에 접속 성공 시 동작할 로직
      console.log('WebSocket 연결 성공');
      client.subscribe('/topic/chat', (message) => {
        const payload: Message = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, payload]);
      });
    },
  });

  useEffect(() => {
    // 연결 상태 변화를 감지하여 동작할 로직
    console.log('WebSocket 연결 상태:', connected);
  }, [connected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      const newMessage: Message = {
        userId: 'user1', // 사용자 아이디 혹은 이름 설정
        userName: 'User 1', // 사용자 이름 설정
        message: messageInput,
      };
      stompClient.current?.publish({
        destination: '/app/send-message',
        body: JSON.stringify(newMessage),
      });
      setMessageInput('');
    }
  };

  return (
    <div>
      <h1>실시간 채팅</h1>
      <div>
        {messages.map((message, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <strong>{message.userName}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
