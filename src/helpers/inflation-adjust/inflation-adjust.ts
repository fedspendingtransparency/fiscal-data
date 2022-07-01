import {ICpiDataMap} from "../../models/ICpiDataMap";

export const adjustDataForInflation = (dataToConvert: any[], dollarValueField: string, dateField: string, cpiYearMap: ICpiDataMap):any[] => {
  const referenceCPIValue = cpiYearMap[Object.keys(cpiYearMap).sort()[Object.keys(cpiYearMap).length - 1]];
  const getYearFromDate = ((dateValue) => {
    return dateValue.substring(0,4);
  });

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
