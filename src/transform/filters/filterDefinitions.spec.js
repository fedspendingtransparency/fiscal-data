import { mockFilters } from '../../components/datasets/mockData/mockFilters';
import { addMissingPublishers } from './filterDefinitions';
const { processFilters, filtersByGroupId, filterByDateRange, filtersByGroupKeyWithName } = require('./filterDefinitions');
const { subDays, subYears, format, parse } = require('date-fns');

const baseMockObject = () => {
  return {
    filterTopics: [],
    techSpecs: {
      lastUpdated: '01/01/1800',
    },
  };
};

const buildMockTechSpecs = (prop, date) => {
  const mock = baseMockObject();
  mock.techSpecs[prop] = format(date, 'MM/dd/yyyy');

  return mock;
};

const buildMockObj = (prop, value) => {
  const mock = baseMockObject();
  mock[prop] = value;

  return mock;
};

const lastUpdatedMockDatasets = compare => {
  const datasetOne = buildMockTechSpecs('lastUpdated', compare);
  const datasetTwo = buildMockTechSpecs('lastUpdated', subDays(compare, 1));

  processFilters(datasetOne);
  processFilters(datasetTwo);

  return { datasetOne, datasetTwo };
};

describe('filterDefinitions', () => {
  const datasetMock = baseMockObject();

  it('matches datasets updated in the last year', () => {
    const aYearAgo = subYears(new Date(), 1);
    const { datasetOne, datasetTwo } = lastUpdatedMockDatasets(aYearAgo);

    expect(datasetOne.filters).toContain('lastYear');
    expect(datasetTwo.filters).not.toContain('lastYear');
  });

  it('matches datasets updated in the last 90 days', () => {
    const ninetyDaysAgo = subDays(new Date(), 90);
    const { datasetOne, datasetTwo } = lastUpdatedMockDatasets(ninetyDaysAgo);

    expect(datasetOne.filters).toContain('ninetyDays');
    expect(datasetTwo.filters).not.toContain('ninetyDays');
  });

  it('matches datasets updated in the last 30 days', () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const { datasetOne, datasetTwo } = lastUpdatedMockDatasets(thirtyDaysAgo);

    expect(datasetOne.filters).toContain('thirtyDays');
    expect(datasetTwo.filters).not.toContain('thirtyDays');
  });

  it('matches datasets updated in the last 7 days', () => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const { datasetOne, datasetTwo } = lastUpdatedMockDatasets(sevenDaysAgo);

    expect(datasetOne.filters).toContain('sevenDays');
    expect(datasetTwo.filters).not.toContain('sevenDays');
  });

  it('matches datasets updated in the last 24 hours', () => {
    const yesterday = subDays(new Date(), 1);
    const { datasetOne, datasetTwo } = lastUpdatedMockDatasets(yesterday);

    expect(datasetOne.filters).toContain('oneDay');
    expect(datasetTwo.filters).not.toContain('oneDay');
  });

  it('establishes the last updated group', () => {
    expect(filtersByGroupId('lastUpdated', mockFilters).length).toBe(5);
    expect(filtersByGroupId('lastUpdated', mockFilters).length).toBe(5);
  });

  it('establishes the file type group', () => {
    expect(filtersByGroupId('dataFormat', mockFilters).length).toBe(6);
  });

  it('matches datasets with csv file type', () => {
    processFilters(datasetMock);
    expect(datasetMock.filters).toContain('csv');
  });

  it('matches datasets with json file type', () => {
    processFilters(datasetMock);
    expect(datasetMock.filters).toContain('json');
  });

  it('matches datasets with xml file type', () => {
    processFilters(datasetMock);
    expect(datasetMock.filters).toContain('xml');
  });

  it('matches datasets with xls file type', () => {
    const mockObj = buildMockObj('dataFormats', ['PDF', 'XLS']);
    processFilters(mockObj);
    expect(mockObj.filters).toContain('xls');
  });

  it('matches datasets with pdf file type', () => {
    const mockObj = buildMockObj('dataFormats', ['PDF', 'XLS']);
    processFilters(mockObj);
    expect(mockObj.filters).toContain('pdf');
  });

  it('does not match datasets if file type does not match', () => {
    const mockObj = buildMockObj('dataFormats', ['DOC', 'TXT']);
    processFilters(mockObj);
    expect(mockObj.filters.pdf).toBeFalsy();
    expect(mockObj.filters.xls).toBeFalsy();
  });

  it('matches datasets that have a start date within date range in startDateRangeOne', () => {
    const datasetOne = buildMockObj('dataStartYear', '1800');
    const datasetTwo = buildMockObj('dataStartYear', '1990');

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('startDateRangeOne');
    expect(datasetTwo.filters).not.toContain('startDateRangeOne');
  });
  it('matches datasets that have a start date within date range in startDateRangeTwo', () => {
    const datasetOne = buildMockObj('dataStartYear', '1993');
    const datasetTwo = buildMockObj('dataStartYear', '2001');

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('startDateRangeTwo');
    expect(datasetTwo.filters).not.toContain('startDateRangeTwo');
  });
  it('matches datasets that have a start date within date range in startDateRangeThree', () => {
    const datasetOne = buildMockObj('dataStartYear', '2009');
    const datasetTwo = buildMockObj('dataStartYear', '1999');

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('startDateRangeThree');
    expect(datasetTwo.filters).not.toContain('startDateRangeThree');
  });
  it('matches datasets that have a start date within date range in startDateRangeThree', () => {
    const datasetOne = buildMockObj('dataStartYear', '2020');
    const datasetTwo = buildMockObj('dataStartYear', '2009');

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('startDateRangeFour');
    expect(datasetTwo.filters).not.toContain('startDateRangeFour');
  });
  it('matches datasets with debt topic filter selected', () => {
    const datasetOne = buildMockObj('filterTopics', ['debt']);
    const datasetTwo = buildMockObj('filterTopics', ['spending']);

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('debt');
    expect(datasetTwo.filters).not.toContain('debt');
  });

  it('matches datasets for DMS', () => {
    const datasetOne = buildMockObj('publisher', 'Debt Management Services');
    const datasetTwo = buildMockObj('publisher', 'Fiscal Accounting');

    addMissingPublishers([datasetOne, datasetTwo]);

    processFilters(datasetOne);
    processFilters(datasetTwo);
    expect(datasetOne.filters).toContain('DMS');
    expect(datasetTwo.filters).not.toContain('DMS');
  });

  it('matches datasets for FA', () => {
    const datasetOne = buildMockObj('publisher', 'Fiscal Accounting');
    const datasetTwo = buildMockObj('publisher', 'Debt Management Services');

    addMissingPublishers([datasetOne, datasetTwo]);

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('FA');
    expect(datasetTwo.filters).not.toContain('FA');
  });

  it('matches datasets for RCM', () => {
    const datasetOne = buildMockObj('publisher', 'Revenue Collections Management');
    const datasetTwo = buildMockObj('publisher', 'Debt Management Services');

    addMissingPublishers([datasetOne, datasetTwo]);

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('RCM');
    expect(datasetTwo.filters).not.toContain('RCM');
  });

  it('matches datasets for RSS', () => {
    const datasetOne = buildMockObj('publisher', 'Retail Securities Services');
    const datasetTwo = buildMockObj('publisher', 'Fiscal Accounting');

    addMissingPublishers([datasetOne, datasetTwo]);

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('RSS');
    expect(datasetTwo.filters).not.toContain('RSS');
  });

  it('matches datasets for WSS', () => {
    const datasetOne = buildMockObj('publisher', 'Wholesale Securities Services');
    const datasetTwo = buildMockObj('publisher', 'Fiscal Accounting');

    addMissingPublishers([datasetOne, datasetTwo]);

    processFilters(datasetOne);
    processFilters(datasetTwo);

    expect(datasetOne.filters).toContain('WSS');
    expect(datasetTwo.filters).not.toContain('WSS');
  });

  it('matches dataset with earliest and latest dates falling in specified date ranges', () => {
    const datasetOne = buildMockObj('techSpecs', {
      earliestDate: '01/01/1999',
      latestDate: '09/01/2020',
    });
    const datasetTwo = buildMockObj('techSpecs', {
      earliestDate: '01/01/1993',
      latestDate: '09/01/2003',
    });
    const from = parse('01/01/2019', 'MM/dd/yyyy', new Date()).setHours(12);
    const to = parse('01/01/2020', 'MM/dd/yyyy', new Date()).setHours(12);
    const options = { startDate: from, endDate: to, exactRange: false };
    const datasetA = filterByDateRange({ dataset: datasetOne, options: options });
    const datasetB = filterByDateRange({ dataset: datasetTwo, options: options });
    expect(datasetA).toBeTruthy();
    expect(datasetB).toBeFalsy();
  });

  it('groups filters by id while including filter name with active/inactive options', () => {
    const filterGroups = filtersByGroupKeyWithName(['revenue', 'startDateRangeTwo', 'startDateRangeThree']);
    expect(filterGroups.length).toBe(6);
    // out of the 6 filter groups, only the ones containing a filter with the id revenue
    // and both filter with id startDateRangeTwo and id startDateRangeThree
    const activeFilterGroups = filterGroups.filter(f => {
      return f.options.some(o => o.active);
    });
    expect(activeFilterGroups.length).toBe(2);
    expect(activeFilterGroups[0].key).toEqual('startDate');
    expect(activeFilterGroups[1].key).toEqual('topics');
  });
});
