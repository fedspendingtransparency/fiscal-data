import { IDatasetApi } from './IDatasetApi';
import { IDatasetTechSpecs } from './IDatasetTechSpecs';

export interface IDatasetConfig {
  apis: IDatasetApi[];
  currentDateButton: string | null;
  customNoChartMessage: boolean | null;
  datePreset: string | null;
  customRangePreset: string | null;
  bannerCallout: Record<string, string> | null;
  datatableBanner: string | null;
  selectColumns: string[] | null;
  detailView: { apiId: number; field: string; label: string; secondaryField: string; dateRangeLockCopy: string; summaryTableFields: string[] } | null;
  dataFormats: string[] | Record<string, unknown>[];
  dataStartYear: string;
  datasetId: string;
  dictionary: number | null;
  filterTopics: string[];
  filters: string[];
  name: string;
  notesAndKnownLimitations: string;
  publishedReports: unknown[];
  publishedReportsTip: string;
  publisher: string;
  relatedDatasets: string[];
  relatedTopics: string[];
  seoConfig: Record<string, string>;
  slug: string;
  summaryTest: string;
  tagLine: string;
  techSpecs: IDatasetTechSpecs;
}
