import React from 'react';
import { summaryValue, tableContainer, tableHeader, sectionHeader, detailContainer } from './summary-table.module.scss';
import { formatCellValue } from '../../../dtg-table/dtg-table-row/dtg-table-row';
const SummaryTable = ({ summaryValues, summaryTable, columnConfig, customFormatConfig }) => {
  const summaryTypes = {};
  const summaryHeaders = {};

  summaryTable.forEach(header => {
    const col = columnConfig.find(configVal => configVal.property === header);
    summaryHeaders[header] = col?.name;
    summaryTypes[header] = col?.type;
  });

  return (
    <>
      {summaryValues && (
        <div className={tableContainer}>
          <div className={tableHeader}>Summary</div>
          <div className={detailContainer}>
            {summaryTable.map(val => (
              <div key={val} className={summaryValue}>
                <div className={sectionHeader}>{summaryHeaders[val]}</div>
                <div>{formatCellValue(summaryValues[val], summaryTypes[val], null, val, customFormatConfig)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryTable;
