import { create } from 'zustand';

export type RedirectModalHelper = {
  open: boolean;
  url: string;
  after?: () => void;
};

type RedirectModalStore = {
  modal: RedirectModalHelper;
  setModal: (next: RedirectModalHelper | ((prev: RedirectModalHelper) => RedirectModalHelper)) => void;
};

export const redirectModalState = create<RedirectModalStore>(set => ({
  modal: { open: false, url: '' },
  setModal: next =>
    set(state => ({
      modal: typeof next === 'function' ? next(state.modal) : next,
    })),
}));
