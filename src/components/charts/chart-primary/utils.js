import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';

export const formatForDataType = (d, dataType, displayRealValues) => {
  const sign = dataType === 'RATE' ? ' %' : '';
  if (displayRealValues) {
    if (dataType === 'CURRENCY') {
      return `$${Number(d).toLocaleString()}`;
    } else {
      return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
    }
  } else {
    return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
  }
};
