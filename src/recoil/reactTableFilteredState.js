import { create } from 'zustand';

export const reactTableFilteredState = create(set => ({
  dateRange: [],
  setDateRange: dateRange => set({ dateRange }),
}));
