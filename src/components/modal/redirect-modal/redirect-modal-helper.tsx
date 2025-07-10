import { atom } from 'recoil';

export type RedirectModalHelper = {
  open: boolean;
  url: string;
  after?: () => void;
};

export const redirectModalState = atom<RedirectModalHelper>({
  key: 'redirectModal',
  default: { open: false, url: '' },
});
