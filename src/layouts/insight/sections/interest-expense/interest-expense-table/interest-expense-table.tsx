import React, { useMemo } from 'react';
import DtgTable from '../../../../../components/dtg-table/dtg-table';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { formatDate } from '../../../../../components/download-wrapper/helpers';

const ChartTableView = ({ chartData, rawExpenseData, rawRateData, sorting, setSorting, tableColumnSortData, setTableColumnSortData }) => {
  const mergedTableData = useMemo(() => {
    if (!chartData || !rawExpenseData || !rawRateData) return [];

    return chartData.map(chartItem => {
      const matchingExpense = rawExpenseData.data.find(exp => parseInt(exp.record_fiscal_year, 10) === chartItem.year);
      const matchingRate = rawRateData.data.find(rate => parseInt(rate.record_fiscal_year, 10) === chartItem.year);

      return {
        record_date: matchingExpense?.record_date,
        year: chartItem.year,
        expense: '$' + getShortForm(chartItem.expense?.toString()),
        rate: chartItem.rate,
        total_debt: matchingRate?.somethingTotalDebt ?? 0,
      };
    });
  }, [chartData, rawExpenseData, rawRateData]);

  const columnConfig = [
    { property: 'record_date', name: 'Record Date', type: 'string' },
    { property: 'expense', name: 'FYTD Interest Expense', type: 'string' },
    { property: 'rate', name: 'Avg Interest Rate', type: 'string' },
    // { property: 'debt_total?!', name: 'Total Debt', type: 'string' }, // need to figure out debt. ask tomorrow in dev collab
    { property: 'year', name: 'Fiscal Year', type: 'string' },
  ];

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
          columnMinWidthDisplay: false,
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
