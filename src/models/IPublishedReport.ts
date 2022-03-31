import { IPublishedReportDataJson } from "./IPublishedReportDataJson"

export interface IPublishedReport {
  expiration: number,
  reports: IPublishedReportDataJson[]
}
