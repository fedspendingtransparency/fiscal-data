export interface IRunTimeReportConfig {
  filterField: string;
  filterLabel: string;
  unmatchedHeader: string;
  unmatchedMessage: string;
  defaultHeader: string;
  defaultMessage: string;
  searchText?: string;
  experimental?: boolean;
  customFilterOption?: string;
  dateFilterLabel?: string;
}
