
export interface IDatasetApi {
  alwaysSortWith: string | null,
  apiId: number,
  dataDisplays: Record<string, unknown>[],
  dateField: string,
  downloadName: string,
  earliestDate: string,
  endpoint: string,
  fields: Record<string, unknown>[],
  isLargeDataset: boolean | null,
  lastUpdated: string,
  latestDate: string,
  pathName: string,
  rowCount: number,
  rowDefinition: string,
  tableDescription: string,
  tableName: string,
  updateFrequency: string,
  userFilter?: {
    label: string,
    field: string,
    notice: string,
    optionValues: string[],
    dataUnmatchedMessage: string
  },
  valueFieldOptions: unknown | null
}
