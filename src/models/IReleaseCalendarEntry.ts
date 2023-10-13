export interface IReleaseCalendarEntry {
  datasetId: string;
  date: string;
  time: string;
  dateTime?: Date;
  released: boolean;
  dataset: {
    name?: string;
    slug?: string;
  };
}
