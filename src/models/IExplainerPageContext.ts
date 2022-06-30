import { ISEOConfig } from "./ISEOConfig";
import { IHeroImage } from "./IHeroImage";
import {IDataset} from "./IDataset";
import {IGlossaryTerm} from "./IGlossaryTerm";

export interface IExplainerPageContext {
  pageName: string,
  breadCrumbLinkName: string,
  seoConfig: ISEOConfig,
  heroImage: IHeroImage,
  relatedDatasets: IDataset[],
  glossary: IGlossaryTerm[],
  cpiDataByYear: any
}
