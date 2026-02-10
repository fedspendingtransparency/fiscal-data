import React from 'react';
import { makeTheDataArray } from './datatables-tab-helpers';
import SuperBasicDtgTable from '../dtg-table/super-basic-dtg-table';

export default function DataTablesTab({ apis, datasetName }) {
  const theData = makeTheDataArray(apis);
  const columnConfig = [
    {
      property: 'name',
      name: 'Table Name',
      order: 1,
      width: 12,
    },
    {
      property: 'description',
      name: 'Description',
      order: 2,
      width: 38,
    },
    {
      property: 'rowDescription',
      name: 'Row Description',
      order: 3,
      width: 38,
    },
    {
      property: 'rowCount',
      name: 'Row Count',
      order: 4,
      width: 12,
      type: 'NUMBER',
    },
  ];

  const tableProps = {
    data: theData,
    columnConfig,
    width: 1104,
    tableName: 'Datatables Tab',
    aria: { 'aria-label': `${datasetName} data tables` },
  };

  return <SuperBasicDtgTable tableProps={tableProps} />;
}
