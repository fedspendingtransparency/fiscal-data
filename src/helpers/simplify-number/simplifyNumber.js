export default function simplifyNumber(n, currency, ignoreDecimal) {
  const negativeSign = n < 0 ? '-' : '',
    dollarSign = currency ? '$' : '',
    digits = parseInt(Math.abs(n)).toString().length,
    sections = Math.ceil(digits / 3),
    letter = sections > 1 ? ' ' + ['K', 'M', 'B', 'T'][sections - 2] : '',
    simplifier = Math.pow(10, sections * 3 - 1) / 100;

  let rounded;

  if (letter === ' T') {
    rounded = sections > 1 ? Math.round((Math.abs(n) / simplifier) * 100) / 100 : new Intl.NumberFormat('en-US').format(Math.round(Math.abs(n)));
    if (rounded.toString().split('.')[1] !== undefined) {
      if (rounded.toString().split('.')[1].length < 2) {
        rounded = `${rounded}0`;
      }
    } else {
      if (ignoreDecimal !== true) {
        rounded = `${rounded}.00`;
      }
    }
  } else if (letter === ' B') {
    rounded = sections > 1 ? Math.round(Math.abs(n) / simplifier) : new Intl.NumberFormat('en-US').format(Math.round(Math.abs(n)));
  } else {
    rounded = sections > 1 ? Math.round((Math.abs(n) / simplifier) * 10) / 10 : new Intl.NumberFormat('en-US').format(Math.round(Math.abs(n)));
  }

  if (n === 0) {
    return dollarSign + '0';
  } else if (Math.abs(n) < 20) {
    rounded = n.toFixed(2);
  }

  console.log(n);
  return `${negativeSign}${dollarSign}${n}`;
}

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
