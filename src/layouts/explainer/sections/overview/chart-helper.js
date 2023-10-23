export const yearAxisFormatter = (value, index, tickCount) => {
  let formattedVal = value.toString();
  if (index >= tickCount - 1) {
    formattedVal = formattedVal + 'T';
  }
  return `$${formattedVal}`;
};

export const monthAxisFormatter = month => {
  const months = ['Oct', 'Jan', 'Apr', 'Jul'];
  return months.includes(month) ? month : '';
};
