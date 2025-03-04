import React, { useMemo } from 'react';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { formatDate } from '../../../../../components/download-wrapper/helpers';

const ChartTableView = ({ mergedTableData, columnConfig, sorting, setSorting }) => {
  return (
    <div>
      <DtgTable
        tableProps={{
          data: mergedTableData,
          columnConfig,
          tableName: 'Interest Expense Details',
          caption: 'Interest Expense and Rates Table',
          shouldPage: true,
          width: '99%',
          chartTable: false,
          noBorder: true,
        }}
        reactTable={true}
        sorting={sorting}
        setSorting={setSorting}
        width
      />
    </div>
  );
};

export default ChartTableView;
