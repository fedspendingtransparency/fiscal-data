export const getShortForm = (
  value: string,
  abbreviate: boolean = true,
  round: boolean = true,
  fractionDigits: number = 0
): string => {

  const trimmed = Math.abs(Number(value)).toFixed();
  const inTrillions = trimmed.length > 12;
  const divisor = inTrillions ? 1000000000000 : 1000000000;
  const trillionLabel = abbreviate ? ' T' : ' trillion';
  const billionLabel = abbreviate ? ' B' : ' billion';
  const appendix = inTrillions ? trillionLabel : billionLabel;
  const digits = round ?
    (inTrillions ? 2 : 0) : fractionDigits;

  return Math.abs(
    (parseFloat(value) / divisor)).toFixed(digits) + appendix;
};

