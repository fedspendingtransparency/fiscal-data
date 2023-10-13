import { IDataset } from './IDataset';

export interface IExplainerRelatedDatasets {
  datasets: IDataset[];
  referrer: string;
  header: string;
  explainer?: boolean;
}
