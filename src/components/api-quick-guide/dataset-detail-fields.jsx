import React from 'react';
import {
  sectionBody,
  dataTypesHeader
} from './api-quick-guide.module.scss';
import DtgTable from "../dtg-table/dtg-table";
import ApiQuickGuideSection from './api-quick-guide-section';
import CustomLink from "../links/custom-link/custom-link";

const addTableName = (fields, table) => {
  fields.forEach(field => field.tableName = table);

  return fields;
};

const DatasetDetailFields = ({ apis }) => {
  const flat = apis.reduce((flattened, current) => {
    if (current.fields) {
      return flattened.concat(addTableName(current.fields, current.tableName));
    } else {
      return flattened;
    }
  }, []);

  const rowsPerPage = 5;

  const excluded = ['definition', 'isRequired'];
  if (apis.length <= 1) {
    excluded.push('tableName');
  }

  const columnConfig = [
    {
      property: 'columnName',
      name: 'Field Name',
      order: 1,
      width: 25
    },
    {
      property: 'prettyName',
      name: 'Display Name',
      order: 2,
      width: 18
    },
    {
      property: 'dataType',
      name: 'Data Type',
      order: 3,
      width: 18
    },
    {
      property: 'tableName',
      name: 'Data Table Name',
      order: 4
    }
  ];

  const tableProps = {
    data: flat,
    tableName: 'Fields',
    shouldPage: true,
    columnConfig,
    excludeCols: excluded,
    width: 1088
  };

  const children = (
    <>
      <div className={sectionBody} id="fields-table">
        <DtgTable tableProps={tableProps} perPage={rowsPerPage} />
      </div>
      <div className={sectionBody} id="fields-datatypes">
        <div className={dataTypesHeader}>
          Data Types
        </div>
        <strong>All data is returned as a string</strong>,
        including nulls. Refer to the chart above for the intended data type of each field.
      </div>
    </>
  );

  const header = {
    title: 'Fields',
    desc: (
      <>
        Refer to{' '}
        <CustomLink url={'#about-this-dataset'}>
          About This Dataset
        </CustomLink>
        {' '}above for a data dictionary with field names and descriptions, as well as notes and
        known limitations.
        known limitations.
      </>
    )
  };

  return (
    <ApiQuickGuideSection
      id="fields-section"
      title={header.title}
      description={header.desc}
      children={children}
    />
  );
};

export default DatasetDetailFields;
