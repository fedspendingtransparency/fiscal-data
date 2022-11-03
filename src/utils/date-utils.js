const getDateWithoutTimeZoneAdjust = (dateStr) => {
  const localDate = new Date(dateStr); // convert to date obj

  // strip timezone indicator then remake date obj
  return new Date(localDate.toISOString().slice(0, -1));
}

module.exports = { getDateWithoutTimeZoneAdjust };
