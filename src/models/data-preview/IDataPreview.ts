import { IDatasetConfig } from '../IDatasetConfig';
import { IPublishedReportDataJson } from '../IPublishedReportDataJson';
import { IDatasetApi } from '../IDatasetApi';

export interface IDataPreview {
  config: IDatasetConfig;
  finalDatesNotFound: boolean;
  location: { pathname: string };
  publishedReportsProp: IPublishedReportDataJson[];
  setSelectedTableProp: (table: IDatasetApi) => void;
  width?: number;
}
