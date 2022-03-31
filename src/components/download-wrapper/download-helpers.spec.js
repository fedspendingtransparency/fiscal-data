import { API_BASE_URL } from "gatsby-env-variables";

import {
  calcDictionaryDownloadSize,
  convertDataDictionaryToCsv,
  dateRangeUrl,
  getDateRangeForFiltration,
  getFilenameForSaveAs,
  replaceNbsps, suggestDictionaryDownloadName
} from './download-helpers';

describe('Dataset Helper function collection', () => {

  it("returns a correctly formatted url", () => {
    const path = 'accounting/od/debt_outstanding';
    const dateFilter = {
      from: '2001-01-31',
      to: '2020-02-29'
    };
    expect(
      dateRangeUrl(path, dateFilter, 'data_date', -1, 'csv', 'data_date')
    ).toEqual(`${API_BASE_URL}/services/api/fiscal_service/accounting/od/debt_outstanding?filter=data_date%3Agte%3A2001-01-31%2Cdata_date%3Alte%3A2020-02-29&format=csv&limit=-1&sort=data_date`);
  });

  it('converts date objects to strings for use in filter param', () => {
    const dateRange = {
      from: new Date(2001,0,31),
      to: new Date(2020,1,29)
    };
    const dateRangeFilter = getDateRangeForFiltration(dateRange);
    expect(dateRangeFilter.from).toEqual('2001-01-31');
    expect(dateRangeFilter.to).toEqual('2020-02-29');
  });

  it('modifies the date format for redemption tables', () => {
    const dateRange = {
      from: new Date(2001,0,31),
      to: new Date(2020,1,29)
    };
    const dateRangeFilter = getDateRangeForFiltration(
      dateRange,
      'v1/accounting/od/redemption_tables'
    );
    expect(dateRangeFilter.from).toEqual('2001-01');
    expect(dateRangeFilter.to).toEqual('2020-02');
  })

  it('formulates the correct user download filename', () => {
    const dateFilter = {
      from: '2001-01-31',
      to: '2020-02-29'
    };
    const dataset = {
      name: 'Debt Outstanding',
      apis: [
        {
          tableName: 'First Table of Debt',
          path: 'accounting/od/debt_outstanding',
          dateField: 'data_date',
          downloadName:'DebtOuts_DebtToTheNickle'
        }
      ]
    };

    // for Datasets with a single default API
    expect(getFilenameForSaveAs(dateFilter, dataset.apis[0], 'xml'))
      .toEqual('DebtOuts_DebtToTheNickle_20010131_20200229.xml');

    // for Datasets with more than one API
    dataset.apis.push({tableName: 'testing dataset with 2 api endpoints'});
    expect(getFilenameForSaveAs(dateFilter, dataset.apis[0], 'json'))
      .toEqual('DebtOuts_DebtToTheNickle_20010131_20200229.json');

  });

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
            "tableName": "table1",
            "columnName": "reporting_date",
            "prettyName": "Calendar Date",
            "definition": "Reporting date for the data",
            "dataType": "DATE",
            "isRequired": "yes"
          },
          {
            "tableName": "table1",
            "columnName": "reporting_date",
            "prettyName": "Calendar Date",
            "definition": "Reporting date for the data",
            "dataType": "DATE",
            "isRequired": "yes"
          },
        ]
      },{
        tableName: 'table2',
        fields: [
          {
            "tableName": "table2",
            "columnName": "reporting_date",
            "prettyName": "Calendar Date",
            "definition": "Reporting date for the data",
            "dataType": "DATE",
            "isRequired": "yes"
          },
          {
            "tableName": "table2",
            "columnName": "reporting_date",
            "prettyName": "Calendar Date",
            "definition": "Reporting date for the data",
            "dataType": "DATE",
            "isRequired": "yes"
          }
        ]
      }
    ]};
    expect(convertDataDictionaryToCsv(dataset)).toMatchSnapshot();
  });

  it('suggests a correctly formatted Data Dictionary download filename', () => {
    expect(suggestDictionaryDownloadName('Debt to the Nickel'))
      .toEqual('Debt to the Nickel Data Dictionary.csv');
  });

  it('calculates the approx filesize size of the CSV download', () => {
    expect(calcDictionaryDownloadSize('0123456789')).toEqual('1 KB');
  });
});
