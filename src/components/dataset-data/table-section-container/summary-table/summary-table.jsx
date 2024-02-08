import React from 'react';
import { summaryValue, tableContainer, tableHeader, sectionHeader, detailContainer } from './summary-table.module.scss';
const SummaryTable = ({ summaryValues, summaryTable, getSummaryTableHeaders }) => {
  return (
    <>
      {summaryValues && (
        <div className={tableContainer}>
          <div className={tableHeader}>Summary</div>
          <div className={detailContainer}>
            {summaryTable.map(val => (
              <div key={val} className={summaryValue}>
                <div className={sectionHeader}>{getSummaryTableHeaders()[val]}</div>
                <div>{summaryValues[val]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryTable;
