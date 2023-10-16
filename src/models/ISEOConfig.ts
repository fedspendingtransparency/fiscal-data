export interface ISEOConfig {
  pageTitle: string;
  description?: string;
  descriptionGenerator?(): string;
  keywords?: string;
  image?: string;
  canonical?: string;
  datasetDetails?: string;
}
