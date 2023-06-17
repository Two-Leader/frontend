import axios from 'axios';
import { OPENVIDU_SERVER_SECRET, OPENVIDU_SERVER_URL } from './BaseUrl';

export async function getToken(roomUuid: string): Promise<any> {
  const session = await createSession(roomUuid);
  return createToken(session);
}

function createSession(roomUuid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ customSessionId: roomUuid });
    axios
      // eslint-disable-next-line prefer-template
      .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
        headers: {
          Authorization:
            // eslint-disable-next-line prefer-template
            'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('CREATE SESION', response);
        resolve(response.data.id);
      })
      .catch((response) => {
        const error = Object.assign(response);
        if (error?.response?.status === 409) {
          resolve(roomUuid);
        } else {
          console.log(error);
          console.warn(
            `No connection to OpenVidu Server. This may be a certificate error at ${OPENVIDU_SERVER_URL}`,
          );
          // eslint-disable-next-line prefer-template
          window.location.assign(`${OPENVIDU_SERVER_URL}/accept-certificate`);
        }
      });
  });
}

function createToken(roomUuid: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = {};
    axios
      .post(
        // eslint-disable-next-line prefer-template
        OPENVIDU_SERVER_URL +
          '/openvidu/api/sessions/' +
          roomUuid +
          '/connection',
        data,
        {
          headers: {
            Authorization:
              // eslint-disable-next-line prefer-template
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        console.log('TOKEN', response);
        resolve(response.data.token);
      })
      .catch((error) => reject(error));
  });
}
