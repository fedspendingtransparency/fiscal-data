import React, { FunctionComponent } from 'react';
import { container, date, emptyRow, headerRow, name, table } from './generative-reports-empty-table.module.scss';
import GenerativeReportsTableNotice from '../generative-reports-table-notice/generative-reports-table-notice';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { reportsBannerCopy } from '../reports-config';

const GenerativeReportsEmptyTable: FunctionComponent = ({ width, apiErrorMessage, noMatchingData, reportGenKey }) => {
  const mobileView = width < pxToNumber(breakpointLg);
  const rowCount = 3;

  const bannerCopy = reportsBannerCopy[reportGenKey];
  const heading = noMatchingData ? bannerCopy.noDataMatchHeader : bannerCopy.additionalFiltersHeader;
  const body = noMatchingData ? bannerCopy.noDataMatchBody : bannerCopy.additionalFiltersBody;

  return (
    <div className={container}>
      <table className={table}>
        <thead>
          {!mobileView && (
            <tr>
              <th className={headerRow}>
                <div className={name}>Name</div>
                <div className={date}>Date</div>
                <div>Size</div>
              </th>
            </tr>
          )}
          {mobileView && (
            <tr>
              <th>Name</th>
            </tr>
          )}
        </thead>
        <tbody>
          {Array.from({ length: rowCount }, (_, index) => (
            <tr key={`row-${index}`}>
              <td className={emptyRow} />
            </tr>
          ))}
        </tbody>
      </table>
      <GenerativeReportsTableNotice heading={heading} bodyText={body} apiErrorMessage={apiErrorMessage} />
    </div>
  );
};

export default GenerativeReportsEmptyTable;
