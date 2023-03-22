


export const quarterNumToTerm = (num) => {
  switch (num) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    case 4:
      return '4th';
  }
}

export const dateStringConverter = (date) => {
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  const offSetDate = new Date(date.getTime() + timeZoneOffset);
  const monthName = offSetDate.toLocaleString('default', { month: 'long' });
  const day = offSetDate.getDate();
  const year = offSetDate.getFullYear();
  return `${monthName} ${day}, ${year}`;
}

export const fastRound = (number) => {
  return (number + (number>0?0.50:-0.50)) << 0;
}

export const apiEndpoint = 'v1/accounting/od/rates_of_exchange?filter=record_date:gte:2015-12-31&sort=currency,-effective_date&page[size]=10000';

export const breadCrumbLinks = [
  {
    name: 'Currency Exchange Rates Convertor'
  },
  {
    name: 'Home',
    link: '/'
  }
];
