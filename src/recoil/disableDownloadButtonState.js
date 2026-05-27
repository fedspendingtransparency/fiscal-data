import { create } from 'zustand';

export const disableDownloadButtonState = create(set => ({
  disabled: false,
  setDisabled: disabled => set({ disabled }),
}));
