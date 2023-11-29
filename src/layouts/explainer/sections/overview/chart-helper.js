export const trillionAxisFormatter = (value, index, tickCount) => {
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

export const longVersionMonth = month => {
  const monthNames = {
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  };
  return monthNames[month];
};
