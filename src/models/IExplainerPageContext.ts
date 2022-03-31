import { ISEOConfig } from "./ISEOConfig";
import { IHeroImage } from "./IHeroImage";

export interface IExplainerPageContext {
  pageName: string,
  breadCrumbLinkName: string,
  seoConfig: ISEOConfig,
  heroImage: IHeroImage
}