export const getShortForm = (
  value: string,
  fractionDigits: number = 0,
  abbreviate: boolean = true,
  defaultDigits: boolean = false,
): string => {

  const trimmed = Math.abs(Number(value)).toFixed();
  const inTrillions = trimmed.length > 12;
  const divisor = inTrillions ? 1000000000000 : 1000000000;
  const trillionLabel = abbreviate ? ' T' : ' trillion';
  const billionLabel = abbreviate ? ' B' : ' billion';
  const appendix = inTrillions ? trillionLabel : billionLabel;
  const digits = defaultDigits ?
    (inTrillions ? 2 : 0) : fractionDigits;

  return Math.abs(
    (parseFloat(value) / divisor)).toFixed(digits) + appendix;
};

export const isBillionsOrTrillions = (num: string, abbr: boolean): string => {
  if (parseFloat(num) < 1000000000000) {
    return getShortForm(num, 0, abbr);
  }
  else if (parseFloat(num) >= 1000000000000) {
    return getShortForm(num, 2, abbr);
  }
}
