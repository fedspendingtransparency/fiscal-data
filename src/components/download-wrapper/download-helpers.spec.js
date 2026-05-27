import { constructDownloadFileName, getDateRangeForFiltration, getFilenameForSaveAs } from './download-helpers';

describe('Dataset Helper function collection', () => {
  it('converts date objects to strings for use in filter param', () => {
    const dateRange = {
      from: new Date(2001, 0, 31),
      to: new Date(2020, 1, 29),
    };
    const dateRangeFilter = getDateRangeForFiltration(dateRange);
    expect(dateRangeFilter.from).toEqual('2001-01-31');
    expect(dateRangeFilter.to).toEqual('2020-02-29');
  });

  it('modifies the date format for redemption tables', () => {
    const dateRange = {
      from: new Date(2001, 0, 31),
      to: new Date(2020, 1, 29),
    };
    const dateRangeFilter = getDateRangeForFiltration(dateRange, 'v1/accounting/od/redemption_tables');
    expect(dateRangeFilter.from).toEqual('2001-01');
    expect(dateRangeFilter.to).toEqual('2020-02');
  });

  it('formulates the correct user download filename', () => {
    const dateFilter = {
      from: '2001-01-31',
      to: '2020-02-29',
    };
    const dataset = {
      name: 'Debt Outstanding',
      apis: [
        {
          tableName: 'First Table of Debt',
          path: 'accounting/od/debt_outstanding',
          dateField: 'data_date',
          downloadName: 'DebtOuts_DebtToTheNickle',
        },
      ],
    };

    // for Datasets with a single default API
    expect(getFilenameForSaveAs(dateFilter, dataset.apis[0], 'xml')).toEqual('DebtOuts_DebtToTheNickle_20010131_20200229.xml');

    // for Datasets with more than one API
    dataset.apis.push({ tableName: 'testing dataset with 2 api endpoints' });
    expect(getFilenameForSaveAs(dateFilter, dataset.apis[0], 'json')).toEqual('DebtOuts_DebtToTheNickle_20010131_20200229.json');
  });

  it('constructs a download file name', () => {
    const dateRange = { from: new Date('12-01-2001'), to: new Date('12-01-2020') };
    const selectedTable = { downloadName: 'testDownloadName' };
    const downloadName = constructDownloadFileName(dateRange, selectedTable);

    expect(downloadName).toBe('testDownloadName_20011201_20201201');
  });
});
