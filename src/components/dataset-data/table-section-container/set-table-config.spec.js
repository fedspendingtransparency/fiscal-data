import { setTableConfig } from './set-table-config';
import {
  selectedTableLessFields,
  selectedTableMoreFields,
  mockConfig,
  mockApiPivotData,
  selectedPivot,
  mockTableWithPivot,
  selectedPivotWithAggregation,
} from './testHelpers';

describe('set table config', () => {
  it('sets the config for complete tables', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, {});
    expect(config).toBeDefined();
  });

  it('sets the config for pivot tables and only includes the intended columns, including record_date when not aggregated', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, selectedPivot, mockApiPivotData);
    expect(config.columnConfig.length).toBe(6);
    expect(config.columnConfig[0].property).toBe('age');
    expect(config.columnConfig.find(cc => cc.property === 'record_date')).toBeDefined();
  });

  it('creates column a column config for displaying table pretty names', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, {});
    expect(typeof config.columnConfig[0].name).toBe('string');
  });

  it('sets appropriate type on columns in config', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, {});
    expect(config.columnConfig[2].type).toBe('DATE');
  });

  it('sets the config for pivot tables and only includes the intended columns and correctly excludes the datefield when aggregation is applied', () => {
    const config = setTableConfig(mockConfig, mockTableWithPivot, selectedPivotWithAggregation, mockApiPivotData);
    expect(config.columnConfig.length).toBe(5);
    expect(config.columnConfig[0].property).toBe('age');
    expect(config.columnConfig.find(cc => cc.property === 'record_date')).toBeUndefined();
  });

  it('sets a table width depending on the number of columns in the data', () => {
    const config = setTableConfig(mockConfig, selectedTableMoreFields, {});
    expect(config.width).toBe(1400);
  });

  it('does not set column width if more than 5 columns', () => {
    const config = setTableConfig(mockConfig, selectedTableMoreFields, {});
    expect(config.columnConfig[0].width).toBeUndefined();
  });

  it('sets a table width to 100% when there are fewer than 5 columns', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, {});
    expect(config.width).toBe('100%');
  });

  it('sets a width of 20 on every column except the last one, only if there are fewer than five columns', () => {
    const config = setTableConfig(mockConfig, selectedTableLessFields, {});
    // this data has three columns, so first two should have width: 20 and the last should
    // have no width assigned
    expect(config.columnConfig[0].width).toBe(20);
    expect(config.columnConfig[1].width).toBe(20);
    expect(config.columnConfig[2].width).toBeUndefined();
  });

  it('filters DATE_RELATED_META_TYPES when pivot title is Complete Table with aggregation', () => {
    const completeTableAggregationPivot = {
      pivotView: {
        chartType: null,
        dimensionField: null,
        title: 'Complete Table',
        aggregateOn: [{ type: 'YEAR' }],
      },
      pivotValue: { columnName: 'age', PrettyName: 'Age' },
    };
    const config = setTableConfig(mockConfig, mockTableWithPivot, completeTableAggregationPivot, mockApiPivotData);
    expect(config.columnConfig).toBeDefined();
    // record_date is excluded by dateField filter, and any remaining DATE-type columns
    // are further excluded by the Complete Table DATE_RELATED_META_TYPES filter
    expect(config.columnConfig.find(cc => cc.property === 'record_date')).toBeUndefined();
  });

  it('sorts pivot fields with missing prettyName values correctly', () => {
    const apiDataWithMissingLabels = {
      data: [{ a: 1 }],
      meta: {
        labels: {
          field_a: null,
          field_b: 'Bravo',
          field_c: undefined,
        },
        dataTypes: {
          field_a: 'string',
          field_b: 'string',
          field_c: 'string',
        },
      },
    };
    const pivotForSort = {
      pivotView: { chartType: null, dimensionField: 'field_a', title: 'By Field' },
      pivotValue: { columnName: 'field_b' },
    };
    const tableForSort = { ...mockTableWithPivot, dateField: 'nonexistent' };
    const config = setTableConfig(mockConfig, tableForSort, pivotForSort, apiDataWithMissingLabels);
    expect(config.columnConfig).toBeDefined();
    expect(config.columnConfig.length).toBe(3);
    // field_b (with prettyName 'Bravo') should sort after the null/undefined prettyName fields
    const names = config.columnConfig.map(cc => cc.name);
    expect(names[names.length - 1]).toBe('Bravo');
  });
});
