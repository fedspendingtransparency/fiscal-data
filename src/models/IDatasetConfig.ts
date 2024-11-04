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

  // used for secondary/nested tables. Clickable on a column value. Comes from datasets/uat/qat
  detailView: {
    apiId: number; // api endpoint it ties to
    field: string; // field that the tables are linking on
    label: string; // name of the Column
    secondaryField: string; // second field the tables are linking on. *** Currently only used for Buybacks
    dateRangeLockCopy: string; // Message displayed in Preview and Download box
    summaryTableFields: string[]; // fields shown in Summary table, and not the nested table itself
    selectColumns: string[]; // fields shown in the nested table
  } | null;

  dataFormats: string[] | Record<string, unknown>[];
  dataStartYear: string;
  datasetId: string;
  dictionary: number | null;
  disableAllTables: boolean | null;
  sharedApiFilterOptions: boolean | null;
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
  slug: string; // the trailing endpoint after "/datasets" Comes from datasets/uat/qat
  summaryTest: string;
  tagLine: string;
  techSpecs: IDatasetTechSpecs;
}
