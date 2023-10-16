const partialSort = require('../../utils/partial-sort').partialSort;

const { parse, isAfter, isSameDay, isBefore, subYears, subDays } = require('date-fns');

const lastUpdatedHelper = (dataset, compare) => {
  if (!dataset.techSpecs || !dataset.techSpecs.lastUpdated) {
    return false;
  }

  const lastUpdated = parse(dataset.techSpecs.lastUpdated, 'MM/dd/yyyy', new Date());
  return isAfter(lastUpdated, compare) || isSameDay(lastUpdated, compare);
};

const filters = [
  {
    id: 'lastYear',
    matcher: dataset => {
      const aYearAgo = subYears(new Date(), 1);
      return lastUpdatedHelper(dataset, aYearAgo);
    },
    groupId: 'lastUpdated',
    label: 'Last Year',
    active: false,
  },
  {
    id: 'ninetyDays',
    matcher: dataset => {
      const ninetyDaysAgo = subDays(new Date(), 90);
      return lastUpdatedHelper(dataset, ninetyDaysAgo);
    },
    groupId: 'lastUpdated',
    label: 'Last 90 Days',
    active: false,
  },
  {
    id: 'thirtyDays',
    matcher: dataset => {
      const thirtyDaysAgo = subDays(new Date(), 30);
      return lastUpdatedHelper(dataset, thirtyDaysAgo);
    },
    groupId: 'lastUpdated',
    label: 'Last 30 Days',
    active: false,
  },
  {
    id: 'sevenDays',
    matcher: dataset => {
      const sevenDaysAgo = subDays(new Date(), 7);
      return lastUpdatedHelper(dataset, sevenDaysAgo);
    },
    groupId: 'lastUpdated',
    label: 'Last 7 Days',
    active: false,
  },
  {
    id: 'oneDay',
    matcher: dataset => {
      const yesterday = subDays(new Date(), 1);
      return lastUpdatedHelper(dataset, yesterday);
    },
    groupId: 'lastUpdated',
    label: 'Last 24 Hours',
    active: false,
  },
  {
    id: 'api',
    matcher: () => {
      return true;
    },
    groupId: 'dataFormat',
    label: 'API',
    active: false,
  },
  {
    id: 'csv',
    matcher: () => {
      return true;
    },
    groupId: 'dataFormat',
    label: 'CSV',
    active: false,
  },
  {
    id: 'json',
    matcher: () => {
      return true;
    },
    groupId: 'dataFormat',
    label: 'JSON',
    active: false,
  },
  {
    id: 'xml',
    matcher: () => {
      return true;
    },
    groupId: 'dataFormat',
    label: 'XML',
    active: false,
  },
  {
    id: 'pdf',
    matcher: dataset => {
      return dataset.dataFormats ? dataset.dataFormats.some(dataFormat => dataFormat === 'PDF') : false;
    },
    groupId: 'dataFormat',
    label: 'Reports (PDF)',
    active: false,
  },
  {
    id: 'xls',
    matcher: dataset => {
      return dataset.dataFormats ? dataset.dataFormats.some(dataFormat => dataFormat === 'XLS') : false;
    },
    groupId: 'dataFormat',
    label: 'Reports (Excel)',
    active: false,
  },
  {
    id: 'startDateRangeOne',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 1790;
      const latestYear = 1989;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    label: '1790 - 1989',
    active: false,
  },
  {
    id: 'startDateRangeTwo',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 1990;
      const latestYear = 1999;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    label: '1990 - 1999',
    active: false,
  },
  {
    id: 'startDateRangeThree',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 2000;
      const latestYear = 2009;
      return startYear >= earliestYear && startYear <= latestYear;
    },
    groupId: 'startDate',
    label: '2000 - 2009',
    active: false,
  },
  {
    id: 'startDateRangeFour',
    matcher: dataset => {
      const startYear = parseInt(dataset.dataStartYear, 10);
      const earliestYear = 2010;
      return startYear >= earliestYear;
    },
    groupId: 'startDate',
    label: '2010 - Present',
    active: false,
  },
  {
    id: 'customDateRange',
    matcher: dataset => {
      return true;
    },
    groupId: 'dateRange',
    label: 'Date Range',
    active: false,
  },
  {
    id: 'auctions',
    slug: 'auctions',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'auctions');
    },
    groupId: 'topics',
    label: 'Auctions',
    active: false,
  },
  {
    id: 'debt',
    slug: 'debt',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'debt');
    },
    groupId: 'topics',
    label: 'Debt',
    active: false,
  },
  {
    id: 'financialSummaries',
    slug: 'financial-summaries',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'financial-summaries');
    },
    groupId: 'topics',
    label: 'Financial Summaries',
    active: false,
  },
  {
    id: 'interestExchangeRates',
    slug: 'interest-exchange-rates',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'interest-exchange-rates');
    },
    groupId: 'topics',
    label: 'Interest & Exchange Rates',
    active: false,
  },
  {
    id: 'revenue',
    slug: 'revenue',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'revenue');
    },
    groupId: 'topics',
    label: 'Revenue',
    active: false,
  },
  {
    id: 'savingsBonds',
    slug: 'savings-bonds',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'savings-bonds');
    },
    groupId: 'topics',
    label: 'Savings Bonds',
    active: false,
  },
  {
    id: 'spending',
    slug: 'spending',
    matcher: dataset => {
      return dataset.filterTopics.some(topic => topic === 'spending');
    },
    groupId: 'topics',
    label: 'Spending',
    active: false,
  },
  // Override auto-creation for RSS due to hard-coded 'Management/CFO'.
  {
    id: 'RSS',
    matcher: dataset => {
      return dataset.publisher === 'Retail Securities Services' || dataset.publisher === 'Management/CFO';
    },
    groupId: 'publisher',
    label: 'Retail Securities Services',
  },
];

const filtersIndexedById = filters =>
  filters.reduce((acc, filter, i) => {
    acc[filter.id] = i;
    return acc;
  }, {});

const processFilters = dataset => {
  // give each dataset an array of the filterIds that match it.
  dataset.filters = filters.filter(fil => fil.matcher(dataset)).map(applicableFilter => applicableFilter.id);
};

const sortPublishers = availableFilters => {
  availableFilters = partialSort(availableFilters, 'groupId', 'publisher', (a, b) => {
    if (a['label'] > b['label']) return 1;
    if (a['label'] < b['label']) return -1;
    return 0;
  });
  return availableFilters;
};

const addMissingPublisher = datasetToCheck => {
  // check if publisher already in filters list...
  if (filters.some(filter => filter.label === datasetToCheck.publisher)) {
    return;
  }
  // if a publisher already exists that matches
  if (filters.filter(filter => filter.groupId === 'publisher').some(filter => filter.matcher(datasetToCheck))) {
    return;
  }

  filters[filters.length] = {
    id: `${datasetToCheck.publisher.match(/(\b)[A-Z]/gm).join('')}`,
    matcher: dataset => {
      return dataset.publisher === datasetToCheck.publisher;
    },
    active: false,
    groupId: 'publisher',
    label: `${datasetToCheck.publisher}`,
  };
};

const addMissingPublishers = datasets => {
  return new Promise(resolve => {
    datasets.forEach(dataset => addMissingPublisher(dataset));
    resolve(filters);
  });
};

const filtersByGroupId = (id, filters) => {
  if (!filters) return [];
  return filters.filter(filter => filter.groupId === id);
};

// this is for user specified date range, not a preset
const filterByDateRange = params => {
  const latestDate = parse(params.dataset.techSpecs.latestDate, 'MM/dd/yyyy', new Date()).setHours(12);
  const earliestDate = parse(params.dataset.techSpecs.earliestDate, 'MM/dd/yyyy', new Date()).setHours(12);

  const from = params.options.startDate;
  const to = params.options.endDate;
  if (!params.options.exactRange) {
    return isBefore(from, latestDate) && isAfter(to, earliestDate);
  } else {
    return isBefore(earliestDate, from) && isAfter(latestDate, to);
  }
};

const groupByKey = list => {
  const updated = [];
  const filterKeys = [
    {
      key: 'dateRange',
      name: 'Date Range',
      options: [],
    },
    {
      key: 'startDate',
      name: 'Start Date',
      options: [],
    },
    {
      key: 'lastUpdated',
      name: 'Last Updated',
      options: [],
    },
    {
      key: 'dataFormat',
      name: 'Data Format',
      options: [],
    },
    {
      key: 'publisher',
      name: 'Dataset Publisher',
      options: [],
    },
    {
      key: 'topics',
      name: 'Topics',
      options: [],
    },
  ];
  filterKeys.forEach(f => {
    const gr = list.filter(s => s.groupId === f.key);
    const ops = Object.assign({}, f, { options: gr });
    updated.push(ops);
  });
  return updated;
};
const filtersByGroupKeyWithName = (activeFilters, filtersList) => {
  const updated = [];

  (filtersList || filters).forEach(f => {
    if (activeFilters.includes(f.id) && !f['active']) {
      updated.push(Object.assign({}, f, { active: true }));
    } else if (f['active'] && !activeFilters.includes(f.id)) {
      updated.push(Object.assign({}, f, { active: false }));
    } else {
      updated.push(f);
    }
  });
  return groupByKey(updated);
};

const filterTools = {
  processFilters,
  sortPublishers,
  addMissingPublishers,
  filtersByGroupId,
  filterByDateRange,
  filtersByGroupKeyWithName,
  filters,
  filtersIndexedById,
  lastUpdatedHelper,
};

module.exports = filterTools;
