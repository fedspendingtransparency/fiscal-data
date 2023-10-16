import { metadataSummaryData, metadataSummaryDataWithMod } from '../../components/datasets/mockData/mockDatasets';
import { parseISO } from 'date-fns';
import { testVariables } from '../../utils/mock-utils';

export const mockSummaryFormattedData = {
  '015-BFS-2014Q1-11': {
    datasetId: metadataSummaryData[0].dataset_id,
    apis: {
      3: {
        ...metadataSummaryData[0].apis[0],
        earliest_date: parseISO(metadataSummaryData[0].apis[0].earliest_date),
        latest_date: testVariables.dates.withinNinetyDays,
        last_updated: testVariables.dates.withinNinetyDays_Updated,
      },
      5: {
        ...metadataSummaryData[0].apis[1],
        earliest_date: parseISO(metadataSummaryData[0].apis[1].earliest_date),
        latest_date: parseISO(metadataSummaryData[0].apis[1].latest_date),
        last_updated: parseISO(metadataSummaryData[0].apis[1].last_updated),
      },
    },
    lastUpdated: testVariables.dates.withinNinetyDays_Updated,
    earliestDate: parseISO('1950-01-01'),
    latestDate: testVariables.dates.withinNinetyDays,
  },
  dataset_id_2: {
    datasetId: metadataSummaryData[1].dataset_id,
    apis: {
      4: {
        ...metadataSummaryData[1].apis[0],
        earliest_date: parseISO(metadataSummaryData[1].apis[0].earliest_date),
        latest_date: testVariables.dates.withinSixtyDays,
        last_updated: testVariables.dates.withinSixtyDays_Updated,
      },
    },
    lastUpdated: testVariables.dates.withinSixtyDays_Updated,
    earliestDate: parseISO('1997-01-31'),
    latestDate: testVariables.dates.withinSixtyDays,
  },
  dataset_id_3: {
    datasetId: metadataSummaryData[2].dataset_id,
    apis: {
      100: {
        ...metadataSummaryData[2].apis[0],
        earliest_date: parseISO(metadataSummaryData[2].apis[0].earliest_date),
        latest_date: parseISO(metadataSummaryData[2].apis[0].latest_date),
        last_updated: parseISO(metadataSummaryData[2].apis[0].last_updated),
      },
      101: {
        ...metadataSummaryData[2].apis[1],
        earliest_date: parseISO(metadataSummaryData[2].apis[1].earliest_date),
        latest_date: parseISO(metadataSummaryData[2].apis[1].latest_date),
        last_updated: parseISO(metadataSummaryData[2].apis[1].last_updated),
      },
      102: {
        ...metadataSummaryData[2].apis[2],
        earliest_date: parseISO(metadataSummaryData[2].apis[2].earliest_date),
        latest_date: testVariables.dates.withinThirtyDays,
        last_updated: testVariables.dates.withinThirtyDays_Updated,
      },
    },
    lastUpdated: testVariables.dates.withinThirtyDays_Updated,
    earliestDate: parseISO('2004-12-31'),
    latestDate: testVariables.dates.withinThirtyDays,
  },
};
export const mockSummaryFormattedDataWithMod = {
  '015-BFS-2014Q1-11': {
    datasetId: metadataSummaryDataWithMod[0].dataset_id,
    apis: {
      3: {
        ...metadataSummaryDataWithMod[0].apis[0],
        earliest_date: parseISO(metadataSummaryDataWithMod[0].apis[0].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[0].apis[0].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[0].apis[0].last_updated),
      },
      5: {
        ...metadataSummaryDataWithMod[0].apis[1],
        earliest_date: parseISO(metadataSummaryDataWithMod[0].apis[1].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[0].apis[1].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[0].apis[1].last_updated),
      },
    },
    lastUpdated: testVariables.dates.withinNinetyDays_Updated,
    earliestDate: parseISO('1950-01-01'),
    latestDate: testVariables.dates.withinNinetyDays,
  },
  dataset_id_2: {
    datasetId: metadataSummaryDataWithMod[1].dataset_id,
    apis: {
      4: {
        ...metadataSummaryDataWithMod[1].apis[0],
        earliest_date: parseISO(metadataSummaryDataWithMod[1].apis[0].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[1].apis[0].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[1].apis[0].last_updated),
      },
    },
    lastUpdated: testVariables.dates.withinSixtyDays_Updated,
    earliestDate: parseISO('1997-01-31'),
    latestDate: testVariables.dates.withinSixtyDays,
  },
  dataset_id_3: {
    datasetId: metadataSummaryDataWithMod[2].dataset_id,
    apis: {
      100: {
        ...metadataSummaryDataWithMod[2].apis[0],
        earliest_date: parseISO(metadataSummaryDataWithMod[2].apis[0].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[2].apis[0].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[2].apis[0].last_updated),
      },
      101: {
        ...metadataSummaryDataWithMod[2].apis[1],
        earliest_date: parseISO(metadataSummaryDataWithMod[2].apis[1].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[2].apis[1].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[2].apis[1].last_updated),
      },
      102: {
        ...metadataSummaryDataWithMod[2].apis[2],
        earliest_date: parseISO(metadataSummaryDataWithMod[2].apis[2].earliest_date),
        latest_date: parseISO(metadataSummaryDataWithMod[2].apis[2].latest_date),
        last_updated: parseISO(metadataSummaryDataWithMod[2].apis[2].last_updated),
      },
    },
    lastUpdated: testVariables.dates.withinThirtyDays_Updated,
    earliestDate: parseISO('2004-12-31'),
    latestDate: testVariables.dates.withinThirtyDays,
  },
};

export const mockPublishedReportsAPIResponse = [
  {
    report_date: '2021-08-31',
    path: '/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_202108.pdf',
    report_group_id: '2',
    report_group_desc: 'STRIPS (.pdf)',
    report_group_sort_order_nbr: '3',
  },
  {
    report_date: '2021-08-31',
    path: '/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_202108.xls',
    report_group_id: '9',
    report_group_desc: 'STRIPS (.xls)',
    report_group_sort_order_nbr: '4',
  },
  {
    report_date: '2021-08-31',
    path: '/static-data/published-reports/mspd-entire/MonthlyStatementPublicDebt_Entire_202108.xls',
    report_group_id: '8',
    report_group_desc: 'Entire (.xls)',
    report_group_sort_order_nbr: '2',
  },
  {
    report_date: '2021-08-31',
    path: '/static-data/published-reports/mspd-entire/MonthlyStatementPublicDebt_Entire_202108.pdf',
    report_group_id: '3',
    report_group_desc: 'Entire (.pdf)',
    report_group_sort_order_nbr: '1',
  },
  {
    report_date: '2021-07-31',
    path: '/static-data/published-reports/mspd-entire/MonthlyStatementPublicDebt_Entire_202107.xls',
    report_group_id: '8',
    report_group_desc: 'Entire (.xls)',
    report_group_sort_order_nbr: '2',
  },
  {
    report_date: '2021-07-31',
    path: '/static-data/published-reports/mspd-strips/MonthlyStatementPublicDebt_STRIPS_202107.pdf',
    report_group_id: '2',
    report_group_desc: 'STRIPS (.pdf)',
    report_group_sort_order_nbr: '3',
  },
];

export const mockPublishedReportsFormattedData = mockPublishedReportsAPIResponse.map(rep => ({ ...rep, report_date: new Date(rep.report_date) }));
