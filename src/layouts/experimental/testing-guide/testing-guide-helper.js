export const datasetSpecs = {
  report: [
    {
      value: 'runTimeReportConfig',
      label: 'Runtime Fetched Reports',
      description: 'Specific reports are fetched at runtime based on user input (filters).',
    },
    { value: 'reportGenKey', label: 'Generated Reports', description: 'PDF reports created from api data.' },
  ],
  table: [
    { value: 'disableAllTables', label: 'Hide "All Tables" option', description: '"All Tables" is not an option on the data table select dropdown.' },
    { value: 'customRangePreset', label: 'Custom Range Preset', description: 'Default range preset is the "custom" option.' },
    { value: 'detailView', label: 'Nested Data Table', description: 'Two tables are nested and linked through a key value.' },
  ],
  apis: [
    {
      value: 'userFilter',
      label: 'User Filter',
      related: 'apiFilter',
      description: 'Filters are not required. Data is filtered within the UI, and filters will not be used within the api calls.',
    },
    {
      value: 'apiFilter',
      label: 'Api Filter',
      related: 'userFilter',
      description: 'Filters are required to view data in the table. Filter selections will be used in the api calls.',
    },
    { value: 'valueFieldOptions', label: 'Pivot Tables' },
    { value: 'isLargeDataset', label: 'Large Dataset', description: '....' },
    { value: '', label: '' },
  ],
};

/*
custom date preset
 */

export const defaultSelection = { label: '(None selected)', value: null };

export const getDatasets = (datasets, config) => {
  const ret = [];
  datasets.forEach(dataset => {
    ret.push({ value: dataset, label: config[dataset].name });
  });
  ret.unshift(defaultSelection);
  return ret;
};
