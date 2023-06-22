import { atom } from 'recoil';

export const MicStatus = atom<boolean>({
  key: 'micStatus',
  default: true,
});
