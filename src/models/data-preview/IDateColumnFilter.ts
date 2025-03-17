export interface IDateColumnFilter {
  columnConfig;
  selectedTable;
  setDateRange: (dateRange) => void;
  allTablesSelected: true;
  setIsFiltered: (filtered: boolean) => void;
  handleDateRangeChange: () => void;
  setIsCustomDateRange: (customDateRange: boolean) => void;
  finalDatesNotFound;
  detailApi: {} | null;
  detailViewState: {} | null;
}
