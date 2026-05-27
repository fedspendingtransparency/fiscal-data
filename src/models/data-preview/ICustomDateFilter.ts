export interface ICustomDateFilter {
  pickerDateRange: {
    from: Date;
    to: Date;
    latestDate: string;
    earliestDate: string;
  };
  disabled: boolean;
}
