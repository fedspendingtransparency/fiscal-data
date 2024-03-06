import { ISEOConfig } from './ISEOConfig';
import { IHeroImage } from './IHeroImage';
import { IDataset } from './IDataset';
import { ICpiDataMap } from './ICpiDataMap';
export interface IExplainerPageContext {
  pageName: string;
  breadCrumbLinkName: string;
  seoConfig: ISEOConfig;
  heroImage: IHeroImage;
  relatedDatasets: IDataset[];
  isAFG: boolean;
  cpiDataByYear: ICpiDataMap;
}
