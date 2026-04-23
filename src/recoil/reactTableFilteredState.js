// import { atom } from 'recoil';
//
// export const reactTableFilteredDateRangeState = atom({
//   key: 'reactTableFilteredDateRangeState',
//   default: [],
// });
import { create } from 'zustand';

export const reactTableFilteredState = create(set => ({
  dateRange: [],
  setDateRange: dateRange => set({ dateRange}),
}));
