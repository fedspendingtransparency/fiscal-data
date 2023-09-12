import {ICpiDataMap} from "../../models/ICpiDataMap";


export const adjustDataForInflation =
  ( dataToConvert: Record<string, number>[], dollarValueField: string, dateField: string, cpiYearMap: ICpiDataMap):Record<string, number>[] => {
  const getYearFromDate = ((dateValue) => {
    return dateValue.substring(0,4);
  });

  const latestEntry = [...dataToConvert].sort((a, b) => (getYearFromDate(b[dateField]) - getYearFromDate(a[dateField])))[0];
  const latestYear = getYearFromDate(latestEntry[dateField]);
  const referenceCPIValue = cpiYearMap[latestYear];

  const convertedData = [];
  dataToConvert.forEach(dataRow => {
    const recordYear = getYearFromDate(dataRow[dateField]);
    const convertedDataValue = dataRow[dollarValueField] * (referenceCPIValue / cpiYearMap[recordYear]);
    const convertedRow = {
      ...dataRow
    };
    convertedRow[dollarValueField] = convertedDataValue;
    convertedData.push(convertedRow);
  })
  return convertedData;
};
