export const getShortForm = (value: string, abbreviate: boolean = true, round: boolean = true, fractionDigits: number = 0): string => {
  const trimmed = Math.abs(Number(value)).toFixed();
  const inTrillions = trimmed.length > 12;
  const inBillions = trimmed.length > 9;
  let divisor;
  if (inTrillions) {
    divisor = 1000000000000;
  } else if (inBillions && !inTrillions) {
    divisor = 1000000000;
  } else if (!inBillions && !inTrillions) {
    divisor = 1000000;
  }
  const trillionLabel = abbreviate ? ' T' : ' trillion';
  const billionLabel = abbreviate ? ' B' : ' billion';
  const millionLabel = abbreviate ? ' M' : ' million';
  let appendix;
  if (inTrillions) {
    appendix = trillionLabel;
  } else if (inBillions && !inTrillions) {
    appendix = billionLabel;
  } else if (!inBillions && !inTrillions) {
    appendix = millionLabel;
  }
  const digits = round ? (inTrillions ? 2 : 0) : fractionDigits;

  const numberShortened = Math.abs(parseFloat(value) / divisor).toFixed(digits);

  const removedTrailingZero = numberShortened.replace(/\.0+$/, '');

  return removedTrailingZero + appendix;
};
