import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  suggestDictionaryDownloadName,
} from './data-dictionary-download-helper';
import { replaceNbsps } from './download-helpers';

describe('Data Dictionary Helper function collection', () => {
  it('removes unwanted non-breaking spaces', () => {
    const words = ['This', 'is', 'a', 'sentence.'];
    const sentenceWithSpaces = 'This is a sentence.';
    const noBreakSentence = words.join(String.fromCharCode(160));
    expect(noBreakSentence).not.toEqual(sentenceWithSpaces);
    expect(replaceNbsps(noBreakSentence)).toEqual(sentenceWithSpaces);
  });

  it('correctly applies the csv formatting to the data dictionary', () => {
    const dataset = {
      datasetId: '015-TLP-2014Q3-065',
      name: 'Debt to the Nickel',
      apis: [
        {
          tableName: 'table1',
          fields: [
            {
              tableName: 'table1',
              columnName: 'reporting_date',
              prettyName: 'Calendar Date',
              definition: 'Reporting date for the data',
              dataType: 'DATE',
              isRequired: 'yes',
            },
            {
              tableName: 'table1',
              columnName: 'reporting_date',
              prettyName: 'Calendar Date',
              definition: 'Reporting date for the data',
              dataType: 'DATE',
              isRequired: 'yes',
            },
          ],
        },
        {
          tableName: 'table2',
          fields: [
            {
              tableName: 'table2',
              columnName: 'reporting_date',
              prettyName: 'Calendar Date',
              definition: 'Reporting date for the data',
              dataType: 'DATE',
              isRequired: 'yes',
            },
            {
              tableName: 'table2',
              columnName: 'reporting_date',
              prettyName: 'Calendar Date',
              definition: 'Reporting date for the data',
              dataType: 'DATE',
              isRequired: 'yes',
            },
          ],
        },
      ],
    };
    expect(convertDataDictionaryToCsv(dataset)).toMatchSnapshot();
  });

  it('suggests a correctly formatted Data Dictionary download filename', () => {
    expect(suggestDictionaryDownloadName('Debt to the Nickel')).toEqual('Debt to the Nickel Data Dictionary.csv');
  });

  it('calculates the approx filesize size of the CSV download', () => {
    expect(calcDictionaryDownloadSize('0123456789')).toEqual('1 KB');
  });
});
