/*
baseurl.ts 파일:
서버 API 및 WebSocket URL, OpenVidu 서버 정보 등의 상수 값을 정의하는 파일입니다.

openviduapi.ts 파일:
OpenVidu 서버와 통신하여 비디오 세션 생성과 토큰 생성을 수행하는 함수를 정의한 파일입니다.

useOpenvidu.ts 파일:
OpenVidu 라이브러리를 사용하여 비디오 세션과 스트림을 관리하는 커스텀 훅입니다.
사용자의 비디오 스트림을 생성하고 OpenVidu 세션에 연결하는 논리를 캡슐화하며, 카메라 및 마이크 상태 변경을 처리합니다.

useStream.ts 파일:
개별 비디오 스트림을 관리하는 커스텀 훅입니다.
스트림의 화면에 표시할 비디오 엘리먼트를 관리하며, 스트림의 화자 상태, 마이크 및 비디오 활성화 상태 변경을 처리합니다.

useWebsocket.ts 파일:
Stomp.js 라이브러리를 사용하여 웹소켓 연결을 관리하는 커스텀 훅입니다.
onConnect 콜백 함수와 연결 재시도 딜레이를 설정하여 웹소켓 연결을 관리하며, 연결 상태를 추적합니다.
*/
export const BASE_URL = 'http://localhost:8080/api/v1';
export const WS_BASE_URL = 'ws://localhost:8080/signal';

export const OPENVIDU_SERVER_URL = 'https://www.twoleader.shop';
export const OPENVIDU_SERVER_SECRET = 'MY_SECRET';
