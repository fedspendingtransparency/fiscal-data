import { ISEOConfig } from './ISEOConfig';
import { IHeroImage } from './IHeroImage';
import { IDataset } from './IDataset';
import { IGlossaryTerm } from './IGlossaryTerm';
import { ICpiDataMap } from './ICpiDataMap';

export interface IExplainerPageContext {
  pageName: string;
  breadCrumbLinkName: string;
  seoConfig: ISEOConfig;
  heroImage: IHeroImage;
  relatedDatasets: IDataset[];
  isAFG: boolean;
  glossary: IGlossaryTerm[];
  cpiDataByYear: ICpiDataMap;
}
