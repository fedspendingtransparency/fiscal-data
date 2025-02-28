export const getTableColumnConfig = (datasetFields, tableFields) => {
  const tableConfig = {};
  tableFields.forEach(field => {
    const colConfig = datasetFields.fields.filter(x => x.columnName === field);
    console.log(colConfig, datasetFields, field);
    const prettyName = colConfig[0].prettyName;
    tableConfig[field] = { prettyName: prettyName, width: 50 };
  });
  return tableConfig;
};
