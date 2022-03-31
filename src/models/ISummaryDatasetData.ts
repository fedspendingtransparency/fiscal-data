import { ISummaryDatasetAPIData } from "./ISummaryDatasetAPIData"

export interface ISummaryDatasetData {
  datasetId: string,
  earliestDate: Date,
  latestDate: Date,
  lastUpdated: Date,
  apis: Record<number, ISummaryDatasetAPIData>
}
