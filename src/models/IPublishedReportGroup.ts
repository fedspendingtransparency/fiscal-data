import { IPublishedReportDataJson } from './IPublishedReportDataJson';

export interface IPublishedReportGroup {
  daily: boolean;
  id: string;
  label: string;
  sortOrderNumber: string;
  value: IPublishedReportDataJson[];
}
