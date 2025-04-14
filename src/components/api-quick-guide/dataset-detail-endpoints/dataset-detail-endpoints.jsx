import React, { useState } from 'react';
import { marginBottomOneRem, sectionBody } from '../api-quick-guide.module.scss';
import DtgTable from '../../dtg-table/dtg-table';
import ApiQuickGuideSection from '../api-quick-guide-section';
import { apiPrefix } from '../../../utils/api-utils';

const DatasetDetailEndpoints = ({ apis, selectedTable }) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const rowsPerPage = 10;

  const handleCopy = async textToCopy => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedEndpoint(textToCopy);
      setTimeout(() => setCopiedEndpoint(null), 1500);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

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
      customRender: row => {
        const fullUrl = `${apiPrefix}${row.endpoint}`;
        return (
          <div>
            <code>{row.endpoint}</code>
            <button onClick={() => handleCopy(fullUrl)}>{copiedEndpoint === fullUrl ? 'Copied' : 'Copy'}</button>
          </div>
        );
      },
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
  const fullURL = `${apiPrefix}${selectedTable.endpoint}`;
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
            <DtgTable tableProps={tableProps} perPage={rowsPerPage} />
          </div>
        </>
      )}
      <div> FULL URL: </div>

      <button onClick={() => handleCopy(fullURL)}>
        <code id="endpoints-fullURL" className={marginBottomOneRem}>
          {copiedEndpoint === fullURL ? 'Copied!' : fullURL}
        </code>
        {/*{copiedEndpoint === fullURL ? 'Copied' : 'Copy'}*/}
      </button>
    </>
  );

  return <ApiQuickGuideSection id="endpoints-section" title={data.length > 1 ? 'Endpoints' : 'Endpoint'} children={children} />;
};

export default DatasetDetailEndpoints;
