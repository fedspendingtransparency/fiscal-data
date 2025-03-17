export interface IDateColumnFilter {
  columnConfig;
  selectedTable;
  setDateRange: (dateRange) => void;
  allTablesSelected: true;
  handleDateRangeChange: () => void;
  setIsCustomDateRange: (customDateRange: boolean) => void;
  finalDatesNotFound;
  detailApi: {} | null;
  detailViewState: {} | null;
}
