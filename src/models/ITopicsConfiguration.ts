export interface ITopicConfiguration {
  label: string;
  title: string;
  slug: string;
  datasetIds: Set<string> | string[];
}
