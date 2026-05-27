export interface IReportTable {
  data: { [key: string]: string }[];
  colConfig: { [key: string]: { prettyName: string; width: number } };
}
