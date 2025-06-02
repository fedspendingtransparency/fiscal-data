import { IDatasetApi } from './IDatasetApi';
import { IDatasetTechSpecs } from './IDatasetTechSpecs';
import { IRunTimeReportConfig } from './IRunTimeReportConfig';
import { IPublishedReportDataJson } from './IPublishedReportDataJson';

export interface IDatasetConfig {
  apis: IDatasetApi[];
  currentDateButton: 'byMonth' | 'byDay' | 'byFullMonth' | null; // byFullMonth will gather data from the entire month, byMonth is just looks at the last day of the month
  hideRawDataTable?: boolean; // true for any dataset with no raw data table, published reports only
  hideReportDatePicker?: boolean; // true for any dataset with only a single published report
  customNoChartMessage: boolean | null; // not used at the moment
  datePreset: string | null;
  customRangePreset: string | null; // *** Currently only used for TRRE
  bannerCallout: Record<string, string> | null;
  datatableBanner: string | null; // Presented in Preview & Download section *** Currently only used for DTS
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
  disableAllTables: boolean | null; // removes the "all tables" options from table dropdown *** currently only used for FBP
  downloadTimestamp: boolean | null; // allows timestamp to be added to downloaded CSV files *** currently only used for FBP
  sharedApiFilterOptions: boolean | null; // api filter options are shared between tables *** Currently only used for FBP
  filterTopics: string[];
  filters: string[];
  name: string;
  notesAndKnownLimitations: string;
  publishedReports: IPublishedReportDataJson[]; // from metadata
  publishedReportsTip: string; // from metadata
  publisher: string; // from metadata
  relatedDatasets: string[];
  relatedTopics: string[];
  seoConfig: Record<string, string>;
  slug: string; // the trailing endpoint after "/datasets" Comes from datasets/uat/qat
  tagLine: string; // from short_description in metadata
  techSpecs: IDatasetTechSpecs;
  reportSelection: 'byReport' | null; // indicates if a report selection filter is available for published reports
  reportGenKey: string | null; // displays a blank table before report generation *** Currently only used for UTF
  runTimeReportConfig: IRunTimeReportConfig; // Config for reports using a run time api filter *** currently only used for FIP: SoA
}
