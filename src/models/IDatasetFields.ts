import { DatasetFieldDataType } from './fdg-types';

export interface IDatasetFields {
  column_name: string;
  definition: string;
  table_nm: string;
  pretty_name: string;
  data_type: DatasetFieldDataType;
  is_required: boolean;
  sort_order_nbr: number;
}
