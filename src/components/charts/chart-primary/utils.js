import simplifyNumber from '../../../helpers/simplify-number/simplifyNumber';

export const formatForDataType = (d, dataType, roundingDenomination, isRoundedAxis) => {
  const sign = dataType === 'RATE' ? ' %' : '';
  if (roundingDenomination) {
    if (dataType === 'CURRENCY') {
      if (isRoundedAxis) {
        return `$${Number(d).toLocaleString()}`;
      }
      return `$${Number(d).toLocaleString()} ${(roundingDenomination.charAt(0).toUpperCase() + roundingDenomination.slice(1)).slice(0, -1)}`;
    } else {
      return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
    }
  } else {
    return simplifyNumber(Number(d), dataType === 'CURRENCY', true) + sign;
  }
};
