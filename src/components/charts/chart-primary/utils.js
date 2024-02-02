import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';

export const formatForDataType = (d, dataType, displayRealValues, roundingDenomination) => {
  const sign = dataType === 'RATE' ? ' %' : '';
  if (displayRealValues && roundingDenomination) {
    if (dataType === 'CURRENCY') {
      if (roundingDenomination) {
        return `$${Number(d).toLocaleString()} ${(roundingDenomination.charAt(0).toUpperCase() + roundingDenomination.slice(1)).slice(0, -1)}`;
      }
      return `$${Number(d).toLocaleString()}`;
    } else {
      return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
    }
  } else {
    return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
  }
};
