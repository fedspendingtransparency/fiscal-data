import { IReportTableConfig } from './IReportTableConfig';

export interface IReportGenerator {
  generatedReport: {
    reportConfig: {
      documentTitle: string;
      downloadName: string;
      documentHeader: { name: string; value?: string; style?: string }[];
      tables: IReportTableConfig[];
    };
  };
}
