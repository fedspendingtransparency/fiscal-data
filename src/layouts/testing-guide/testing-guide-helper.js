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
    { value: 'detailView', label: 'Nested Tables', description: 'Two tables are nested and linked through a key value.' },
  ],
  apis: [
    {
      value: 'userFilter',
      label: 'Non-Required Table Filter',
      related: 'apiFilter',
      description:
        'By default, the table will load with unfiltered data. When a filter is selected, the value is used to ' +
        'filter the table within the UI (filter values will not be used within the tables API call).',
    },
    {
      value: 'apiFilter',
      label: 'Required Table Filter',
      related: 'userFilter',
      description: 'By default, the table will be empty. When a filter is selected, the value is used as a filter in the tables API call.',
    },
    { value: 'valueFieldOptions', label: 'Pivot Tables' },
    {
      value: 'isLargeDataset',
      label: 'Large Dataset',
      description:
        'Large datasets contain at least one table with more than 8500 rows. ' +
        'Data within any pivot tables for this dataset will be aggregated by the given Time Period for the selected pivot option' +
        '\nNote: This is not the threshold used when determining if filtering is available for a given data table.',
    },
  ],
};

/*
report date picker

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
