export const ensureDoubleDigitDate = value => {
  if (parseInt(value, 10) < 10) {
    return `0${value}`;
  }
  return value.toString();
};

export const formatDate = date => {
  const day = ensureDoubleDigitDate(date.getDate());
  const month = ensureDoubleDigitDate(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};
