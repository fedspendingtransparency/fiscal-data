import React from 'react';
import { marginBottomOneRem, sectionBody } from '../api-quick-guide.module.scss';
import ApiQuickGuideSection from '../api-quick-guide-section';
import { apiPrefix } from '../../../utils/api-utils';

const DatasetDetailEndpoints = ({ apis, selectedTable }) => {
  const rowsPerPage = 10;

  const data = apis.map(a => {
    return {
      endpoint: a.endpoint !== undefined ? `/${a.endpoint}` : '',
      table: a.tableName || '',
    };
  });

  const columnConfig = [
    {
      property: 'table',
      name: 'Table Name',
      order: 1,
      width: 25,
    },
    {
      property: 'endpoint',
      name: 'Endpoint',
      order: 2,
      width: 25,
    },
  ];

  const tableProps = {
    data,
    tableName: 'Endpoints',
    shouldPage: true,
    columnConfig,
    aria: {
      'aria-label': `${selectedTable.tableName} API Endpoints`,
    },
  };

  const children = (
    <>
      <div> BASE URL: </div>
      <code id="endpoints-baseURL" className={marginBottomOneRem}>
        {apiPrefix}
      </code>
      {data.length <= 1 ? (
        <>
          <div> ENDPOINT: </div>
          <code id="endpoints-endpoint" className={marginBottomOneRem}>
            {selectedTable.endpoint}
          </code>
        </>
      ) : (
        <>
          <div className={sectionBody} id="endpoints-table">
            <SuperBasicDtgTable tableProps={tableProps} perPage={rowsPerPage} />
          </div>
        </>
      )}
      <div> FULL URL: </div>
      <code id="endpoints-fullURL" className={marginBottomOneRem}>
        {apiPrefix}
        {selectedTable.endpoint}
      </code>
    </>
  );

  return <ApiQuickGuideSection id="endpoints-section" title={data.length > 1 ? 'Endpoints' : 'Endpoint'} children={children} />;
};

export default DatasetDetailEndpoints;
