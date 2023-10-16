/* istanbul ignore file */
import { lastUpdatedHelper } from '../../../transform/filters/filterDefinitions';
const { subYears, subDays } = require('date-fns');

export const mockFilters = [
  {
    id: 'lastYear',
    label: 'lastYear',
    groupId: 'lastUpdated',
    matcher: dataset => {
      const aYearAgo = subYears(new Date(), 1);
      return lastUpdatedHelper(dataset, aYearAgo);
    },
    active: false,
  },
  {
    id: 'oneDay',
    label: 'oneDay',
    matcher: dataset => {
      const yesterday = subDays(new Date(), 1);
      return lastUpdatedHelper(dataset, yesterday);
    },
    groupId: 'lastUpdated',
    active: false,
  },
  {
    id: 'sevenDays',
    label: 'sevenDays',
    matcher: dataset => {
      const sevenDaysAgo = subDays(new Date(), 7);
      return lastUpdatedHelper(dataset, sevenDaysAgo);
    },
    groupId: 'lastUpdated',
    active: false,
  },
  {
    id: 'thirtyDays',
    label: 'thirtyDays',
    matcher: dataset => {
      const thirtyDaysAgo = subDays(new Date(), 30);
      return lastUpdatedHelper(dataset, thirtyDaysAgo);
    },
    groupId: 'lastUpdated',
    active: false,
  },
  {
    id: 'ninetyDays',
    label: 'ninetyDays',
    matcher: dataset => {
      const ninetyDaysAgo = subDays(new Date(), 90);
      return lastUpdatedHelper(dataset, ninetyDaysAgo);
    },
    groupId: 'lastUpdated',
    active: false,
  },
  {
    id: 'startDateRangeOne',
    label: 'startDateRangeOne',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 1790;
      const latestYear = 1989;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    active: false,
  },
  {
    id: 'startDateRangeTwo',
    label: 'startDateRangeTwo',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 1990;
      const latestYear = 1999;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    active: false,
  },
  {
    id: 'startDateRangeThree',
    label: 'startDateRangeThree',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 2000;
      const latestYear = 2009;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    active: false,
  },
  {
    id: 'startDateRangeFour',
    label: 'startDateRangeFour',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 2010;
      return startYear >= earliestYear;
    },
    groupId: 'startDate',
    active: false,
  },
  {
    id: 'csv',
    label: 'csv',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'api',
    label: 'api',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'json',
    label: 'json',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'xml',
    label: 'xml',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'pdf',
    label: 'pdf',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'xls',
    label: 'xls',
    matcher: dataset => true,
    groupId: 'dataFormat',
    active: false,
  },
  {
    id: 'customDateRange',
    label: 'customDateRange',
    matcher: dataset => true,
    groupId: 'dateRange',
    active: false,
  },
  {
    id: 'savingsBonds',
    label: 'savingsBonds',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'savings-bonds');
    },
    groupId: 'topics',
    active: false,
  },
  {
    id: 'interestExchangeRates',
    label: 'interestExchangeRates',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'interest-exchange-rates');
    },
    groupId: 'topics',
    active: false,
  },
  {
    id: 'debt',
    label: 'debt',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'debt');
    },
    groupId: 'topics',
    active: false,
  },
];
