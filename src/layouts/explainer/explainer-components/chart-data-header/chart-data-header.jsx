import React from 'react';
import { headerContainer, headerData, dataValue, dataLabel, dataElement, dateFieldLabel } from './chart-data-header.module.scss';

const ChartDataHeader = ({ fiscalYear, right, left, dateField }) => {
  return (
    <div className={headerContainer}>
      <div className={headerData}>
        <div className={dataElement}>
          <div className={dataValue}>{fiscalYear}</div>
          <span className={dateFieldLabel}>{dateField ? dateField : 'Fiscal Year'}</span>
        </div>
        <div className={dataElement}>
          <div className={dataValue}>{right.value}</div>
          <span className={dataLabel}>{right.label}</span>
        </div>
        {left && (
          <div className={dataElement}>
            <div className={dataValue}>{left.value}</div>
            <span className={dataLabel}>{left.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDataHeader;
