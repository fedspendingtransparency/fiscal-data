import React, { FunctionComponent } from 'react';
import DateColumnFilter from './date-column-filter/date-column-filter';

interface IColumnFilterOptions {
  selectedColumn: { name: string; type: string };
}

const ColumnFilterOptions: FunctionComponent<IColumnFilterOptions> = ({ selectedColumn }) => {
  return <>{selectedColumn.type === 'Date' && <DateColumnFilter columnConfig={selectedColumn} />}</>;
};

export default ColumnFilterOptions;
