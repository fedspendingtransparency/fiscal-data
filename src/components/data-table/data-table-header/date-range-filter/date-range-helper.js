export const completeDate = date => {
  return !date?.includes('d') && !date?.includes('m') && !date?.includes('y');
};
