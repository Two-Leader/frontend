import { atom } from 'recoil';

interface Job {
  webCamStatus: boolean;
  micStatus: boolean;
}

export const WebCamStatus = atom<Job>({
  key: 'webCamstatus',
  default: { webCamStatus: true, micStatus: true },
});
