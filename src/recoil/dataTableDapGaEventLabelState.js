import { create } from 'zustand';

export const dataTableDapGaEventLabelState = create(set => ({
  label: '',
  setLabel: label => set({ label }),
}));
