import { IDatasetFields } from './IDatasetFields';
import { DatasetFieldDataType } from './fdg-types';
import { ImageFormat } from '../components/home-highlight-cards/highlighted-datasets-config';

interface transformFunction {
  (dataset: IDatasetData, res: any): any[];
}
interface valueCalculatorFunction {
  (dataset: IDatasetData, res: any): any[];
}

interface colorsFunction {
  (d: any): any;
}

export interface IDatasetData {
  api_id: number;
  limit: number;
  colors: colorsFunction;
  transform: transformFunction;
  valueCalculator: valueCalculatorFunction;
  chartType: string;
  index: string;
  table_nm: string;
  table_description: string;
  update_frequency: string;
  row_definition: string;
  last_updated: string;
  earliest_date: string;
  latest_date: string;
  value_fields: string[];
  filters: {};
  sorts: string[];
  noRecordDateInFields: boolean;
  fields: IDatasetFields[];
  format: DatasetFieldDataType;
  image: ImageFormat;
}
