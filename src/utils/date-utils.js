const getDateWithoutTimeZoneAdjust = dateStr => {
  const localDate = new Date(dateStr); // convert to date obj

  // strip timezone indicator then remake date obj
  return new Date(localDate.toISOString().slice(0, -1));
};

const getFirstOfTheMonth = date => {
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month, 1);
};

const getLastOfTheMonth = date => {
  const month = date.getMonth();
  const year = date.getFullYear();
  return new Date(year, month + 1, 0);
};

module.exports = { getDateWithoutTimeZoneAdjust, getLastOfTheMonth, getFirstOfTheMonth };
