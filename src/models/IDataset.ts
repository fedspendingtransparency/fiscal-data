import { IDatasetData } from './IDatasetData';
import { IDatasetApi } from './IDatasetApi';

export interface IDataset {
  datasetId: string;
  name: string;
  slug: string;
  data?: IDatasetData;
  title?: string;
  tagLine?: string;
  apis?: IDatasetApi[];
  displayOrder?: number;
  relatedTopics?: string[];
}
