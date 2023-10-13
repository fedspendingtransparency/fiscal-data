import { basicFetch } from '../../utils/api-utils';
import { mockMaxDates } from '../../layouts/dataset-detail/helper';
import { API_BASE_URL } from 'gatsby-env-variables';

const metadataSummary = () => {
  return basicFetch(API_BASE_URL + '/services/dtg/metadata/summary');
};

const createObjectKeys = (data, _datasetIds) => {
  let datasetIds = [];
  let summaryData = data;

  if (_datasetIds && (typeof _datasetIds === 'string' || _datasetIds instanceof Array)) {
    datasetIds = datasetIds.concat(_datasetIds);
    summaryData = summaryData.filter(obj => {
      return datasetIds.some(id => id === obj.dataset_id);
    });
  }
  return summaryData.reduce((obj, el) => {
    obj[el.dataset_id] = el;
    return obj;
  }, {});
};

export const mockSummaryAPIReturn = [
  {
    dataset_id: '111',
    apis: [
      {
        api_id: '1',
        last_updated: mockMaxDates.lastUpdated,
        latest_date: '2021-11-30',
      },
      {
        api_id: '2',
        last_updated: '2022-01-01',
        latest_date: mockMaxDates.latestDate,
      },
      {
        api_id: '3',
        last_updated: '',
        latest_date: '',
      },
    ],
  },
  {
    dataset_id: '222',
    apis: [
      {
        api_id: '11',
        last_updated: '2020-01-01',
        latest_date: '2021-11-30',
      },
    ],
  },
];

export const mockObjectKeysReturn = {
  '111': {
    dataset_id: '111',
    apis: [
      {
        api_id: '1',
        last_updated: mockMaxDates.lastUpdated,
        latest_date: '2021-11-30',
      },
      {
        api_id: '2',
        last_updated: '2022-01-01',
        latest_date: mockMaxDates.latestDate,
      },
      {
        api_id: '3',
        last_updated: '',
        latest_date: '',
      },
    ],
  },
  '222': {
    dataset_id: '222',
    apis: [
      {
        api_id: '11',
        last_updated: '2020-01-01',
        latest_date: '2021-11-30',
      },
    ],
  },
};

export const mockObjectKeysReturnFiltered = {
  '222': {
    dataset_id: '222',
    apis: [
      {
        api_id: '11',
        last_updated: '2020-01-01',
        latest_date: '2021-11-30',
      },
    ],
  },
};

const metadataHelper = {
  createObjectKeys,
  metadataSummary,
  mockSummaryAPIReturn,
  mockObjectKeysReturn,
  mockObjectKeysReturnFiltered,
};

export default metadataHelper;
