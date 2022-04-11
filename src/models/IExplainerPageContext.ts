import { ISEOConfig } from "./ISEOConfig";
import { IHeroImage } from "./IHeroImage";
import {IDataset} from "./IDataset";

export interface IExplainerPageContext {
  pageName: string,
  breadCrumbLinkName: string,
  seoConfig: ISEOConfig,
  heroImage: IHeroImage,
  relatedDatasets: IDataset[]
}
