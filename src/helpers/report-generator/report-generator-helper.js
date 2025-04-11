export const getTableColumnConfig = (datasetFields, tableFields) => {
  const tableConfig = {};
  tableFields.forEach(field => {
    const colConfig = datasetFields.fields.filter(x => x.columnName === field.name);
    tableConfig[field.name] = { width: field.width, ...colConfig[0] };
  });
  return tableConfig;
};
