import { calcDictionaryDownloadSize, convertDataDictionaryToCsv, prettySize, suggestDictionaryDownloadName } from './data-dictionary-download-helper';
import { replaceNbsps } from './download-helpers';
import { fileSizeTranslator2 } from '../datatables-tab/datatables-tab-helpers';
jest.mock('../datatables-tab/datatables-tab-helpers', () => {
  const actual = jest.requireActual('../datatables-tab/datatables-tab-helpers');
  return {
    ...actual,
    fileSizeTranslator2: jest.fn(),
  };
});

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
  describe('prettySize', () => {
    beforeEach(() => {
      fileSizeTranslator2.mockReset();
    });

    it('uses fileSizeTranslator2 on string data', () => {
      const str = 'hello';
      const expectedBytes = new Blob([str]).size;
      fileSizeTranslator2.mockReturnValue('5 B');

      const result = prettySize(str);

      expect(fileSizeTranslator2).toHaveBeenCalledWith(expectedBytes);
      expect(result).toBe('5 B');
    });

    it('uses fileSizeTranslator2 on Blob data', () => {
      const blob = new Blob(['abcdef']);
      fileSizeTranslator2.mockReturnValue('6 B');

      const result = prettySize(blob);

      expect(fileSizeTranslator2).toHaveBeenCalledWith(blob.size);
      expect(result).toBe('6 B');
    });

    it('uses fileSizeTranslator2 on array of rows', () => {
      const rows = [
        ['a', 'b'],
        ['c', 'd'],
      ];
      const csvString = 'a,b\nc,d';
      fileSizeTranslator2.mockReturnValue('7 B');
      const result = prettySize(rows);
      expect(fileSizeTranslator2).toHaveBeenCalledWith(new Blob([csvString]).size);
      expect(result).toBe('7 B');
    });

    it('falls back to "-" for unsupported types', () => {
      expect(prettySize(123)).toBe('-');
    });

    it('falls back to "-" if translator returns falsy', () => {
      fileSizeTranslator2.mockReturnValue('');
      expect(prettySize('x')).toBe('-');
    });
  });
});
