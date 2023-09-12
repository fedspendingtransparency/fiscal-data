import { IDatasetApi } from "./IDatasetApi"
import { IDatasetTechSpecs } from "./IDatasetTechSpecs"

export interface IDatasetConfig {
  apis: IDatasetApi[],
  currentDateButton: string | null,
  datePreset: string | null,
  customRangePreset: string | null,
  bannerCallout: Record<string, string> | null,
  selectColumns: string[] | null,
  dataFormats: string[] | Record<string, unknown>[],
  dataStartYear: string,
  datasetId: string,
  dictionary: number | null,
  filterTopics: string[],
  filters: string[]
  name: string,
  notesAndKnownLimitations: string,
  publishedReports: unknown[],
  publishedReportsTip: string,
  publisher: string,
  relatedDatasets: string[],
  relatedTopics: string[],
  seoConfig: Record<string, string>,
  slug: string,
  summaryTest: string,
  tagLine: string,
  techSpecs: IDatasetTechSpecs
}
