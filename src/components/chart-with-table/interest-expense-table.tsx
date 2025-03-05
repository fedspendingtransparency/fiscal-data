import React from 'react';
import DtgTable from '../dtg-table/dtg-table';

interface ChartTableViewProps {
  mergedTableData: any[];
  columnConfig: any[];
  sorting: any;
  setSorting: (sorting: any) => void;
}

const ChartTableView: React.FC<ChartTableViewProps> = ({ mergedTableData, columnConfig, sorting, setSorting }) => {
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
