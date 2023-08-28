import React from 'react';
import DtgTable from "../dtg-table/dtg-table";
import { makeTheDataArray } from "./datatables-tab-helpers";

export default function DataTablesTab({ apis, datasetName }) {
  const theData = makeTheDataArray(apis);
  const columnConfig = [
    {
      property: 'name',
      name: 'Table Name',
      order: 1,
      width: 12
    },
    {
      property: 'description',
      name: 'Description',
      order: 2,
      width: 38
    },
    {
      property: 'rowDescription',
      name: 'Row Description',
      order: 3,
      width: 38
    },
    {
      property: 'fileSizes',
      name: 'File Sizes',
      order: 4,
      width: 12
    },
    {
      property: 'rowCount',
      name: 'Row Count',
      order: 5,
      width: 12
    }
  ];

  const tableProps = {
    data: theData,
    columnConfig,
    width: 1104,
    tableName: 'Datatables Tab',
    aria: {"aria-label": `${datasetName} data tables`}
  };

  return(
    <DtgTable  tableProps={tableProps} />
  )
}
