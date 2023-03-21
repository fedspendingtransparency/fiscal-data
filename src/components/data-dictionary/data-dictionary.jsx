import React from 'react';
import DtgTable from "../dtg-table/dtg-table";

const addTableName = (fields, table) => {
  fields.forEach(field => field.tableName = table);

  return fields;
}

const DataDictionary = ({ apis, datasetName }) => {
  const flat = apis.reduce((flattened, current, i) => {
    if (current.fields) {
      return flattened.concat(addTableName(current.fields, current.tableName));
    } else {
      return flattened;
    }
  }, []);

  const rowsPerPage = 5;

  const columnConfig = [
    {
      property: 'tableName',
      name: 'Data Table Name',
      order: 1,
      width: 12
    },
    {
      property: 'columnName',
      name: 'Field Name',
      order: 2,
      width: 12
    },
    {
      property: 'prettyName',
      name: 'Display Name',
      order: 3,
      width: 12
    },
    {
      property: 'definition',
      name: 'Description',
      order: 4,
      width: 40
    },
    {
      property: 'dataType',
      name: 'Data Type',
      order: 5,
      width: 9
    },
    {
      property: 'isRequired',
      name: 'Is Required',
      order: 6,
      width: 9
    }
  ];

  const tableProps = {
    columnConfig,
    data: flat,
    width: 1400,
    tableName: 'Data Dictionary',
    shouldPage: true,
    aria: {"aria-label": `${datasetName} data dictionary`}
  };

  return (
    <DtgTable tableProps={tableProps} perPage={rowsPerPage} />
  )
}

export default DataDictionary;
