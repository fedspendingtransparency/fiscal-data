export const getTableColumnConfig = (datasetFields, tableFields) => {
  const tableConfig = {};
  tableFields.forEach(field => {
    const colConfig = datasetFields.fields.filter(x => x.columnName === field.name);
    const prettyName = colConfig[0].prettyName;
    tableConfig[field.name] = { prettyName: prettyName, width: field.width };
  });
  return tableConfig;
};
