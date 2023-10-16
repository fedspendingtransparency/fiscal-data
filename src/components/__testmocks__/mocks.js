export const pageContextMock = {
  isCreatedByStatefulCreatePages: false,
  config: {
    apis: [
      {
        dateField: 'reporting_date',
        endpoint: 'accounting/od/savings_bonds_pcs',
        fields: ['series_cd', 'type_cd', 'total_pcs_cnt'],
        dimension: {
          key: 'series_cd',
          value: 'total_pcs_cnt',
        },
        filter: null,
      },
    ],
    name: 'Savings Bonds Pieces - DIMENSIONAL',
    popular: null,
    dataStartYear: 1990,
    slug: '/savings-bonds-pieces-dim/',
    summaryText: 'Test summary data',
    tags: ['sample'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  },
  experimental: false,
};

export const pageContextMockOneRow = {
  isCreatedByStatefulCreatePages: false,
  config: {
    apis: [
      {
        dateField: 'reporting_date',
        endpoint: 'accounting/od/savings_bonds_pcs_onerow',
        fields: ['series_cd', 'type_cd', 'total_pcs_cnt'],
        dimension: {
          key: 'series_cd',
          value: 'total_pcs_cnt',
        },
        filter: null,
      },
    ],
    name: 'Savings Bonds Pieces - DIMENSIONAL',
    popular: null,
    dataStartYear: 1990,
    slug: '/savings-bonds-pieces-dim/',
    summaryText: 'Test summary data',
    tags: ['sample'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  },
  experimental: false,
};

export const pageContextMockForErrorStatus = {
  isCreatedByStatefulCreatePages: false,
  config: {
    apis: [
      {
        dateField: 'reporting_date',
        endpoint: 'accounting/od/savings_bonds_pcs-error-status',
        fields: ['series_cd', 'type_cd', 'total_pcs_cnt'],
        dimension: {
          key: 'series_cd',
          value: 'total_pcs_cnt',
        },
        filter: null,
      },
    ],
    name: 'Savings Bonds Pieces - DIMENSIONAL',
    popular: null,
    dataStartYear: 1990,
    slug: '/savings-bonds-pieces-dim/',
    summaryText: 'Test summary data',
    tags: ['sample'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  },
  experimental: false,
};

export const pageContextMockForWrongContentType = {
  isCreatedByStatefulCreatePages: false,
  config: {
    apis: [
      {
        dateField: 'reporting_date',
        endpoint: 'accounting/od/savings_bonds_pcs-html-content',
        fields: ['series_cd', 'type_cd', 'total_pcs_cnt'],
        dimension: {
          key: 'series_cd',
          value: 'total_pcs_cnt',
        },
        filter: null,
      },
    ],
    name: 'Savings Bonds Pieces - DIMENSIONAL',
    popular: null,
    dataStartYear: 1990,
    slug: '/savings-bonds-pieces-dim/',
    summaryText: 'Test summary data',
    tags: ['sample'],
    techSpecs: {
      lastUpdated: '12/19/2019',
      fileFormat: null,
    },
  },
  experimental: false,
};
