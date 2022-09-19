import {ICpiDataMap} from "../../models/ICpiDataMap";

export const adjustDataForInflation = (dataToConvert: any[], dollarValueField: string, dateField: string, cpiYearMap: ICpiDataMap):any[] => {
  const getYearFromDate = ((dateValue) => {
    return dateValue.substring(0,4);
  });

  const latestEntry = [...dataToConvert].sort((a, b) => (getYearFromDate(b[dateField]) - getYearFromDate(a[dateField])))[0];
  const latestYear = getYearFromDate(latestEntry[dateField]);
  const referenceCPIValue = cpiYearMap[latestYear];

  const convertedData = [];
  dataToConvert.forEach(dataRow => {
    const recordYear = getYearFromDate(dataRow[dateField]);
    console.log(recordYear);
    console.log(dollarValueField);
    console.log(dataRow[dollarValueField]);
    console.log(cpiYearMap["2020"]);
    const convertedDataValue = dataRow[dollarValueField] * (referenceCPIValue / cpiYearMap[recordYear]);
    const convertedRow = {
      ...dataRow
    };
    convertedRow[dollarValueField] = convertedDataValue;
    convertedData.push(convertedRow);
  })
  return convertedData;
};
