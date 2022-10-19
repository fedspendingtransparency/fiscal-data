import simplifyNumber from "../../../helpers/simplify-number/simplifyNumber";

export function formatForDataType(d, dataType) {
    const sign = dataType === 'RATE' ? ' %' : '';
    return simplifyNumber(Number(d), (dataType === 'CURRENCY'), true) + sign;
}
