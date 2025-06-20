import { ReactElement } from 'react';
import { IDatasetApi } from '../IDatasetApi';
import { IPivotOption } from './IPivotOption';
import { IDatasetConfig } from '../IDatasetConfig';

export interface DataPreviewFilterSectionProps {
  width?: number;
  children: ReactElement | string;
  dateRange: { from: string; to: string };
  isFiltered: boolean;
  selectedTable: IDatasetApi;
  selectedPivot: IPivotOption;
  dataset: IDatasetConfig;
  allTablesSelected: boolean;
  isCustomDateRange: boolean;
  selectedUserFilter;
  tableColumnSortData: [];
  filteredDateRange?: { from: string; to: string };
  selectedDetailViewFilter?: { field: string; value: string };
  apiFilterDefault;
  setViewMode: (mode: string) => void;
}
