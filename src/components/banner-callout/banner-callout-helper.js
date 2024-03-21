import CustomLink from '../links/custom-link/custom-link';
import React from 'react';
import { updateList, header, suggestions, columnFlex, altBannerHeader } from './banner-callout.module.scss';
export const calloutConfig = {
  XRCallout: {
    copy: (
      <>
        To calculate foreign currency exchange rates for tax reporting, visit the{' '}
        <CustomLink url="/currency-exchange-rates-converter/">Currency Exchange Rates Converter</CustomLink> page.
      </>
    ),
  },
  XRPageWarning: {
    copy: (
      <>
        <span className={header}>No exchange rate available for this date range.</span>
        <div className={suggestions}>
          <span className={header}>Suggestions</span>
          <ul>
            <li>Check the currency name as it may have changed.</li>
            <li>Select a different date range.</li>
          </ul>
        </div>
      </>
    ),
    customMargin: '1.5rem',
  },
  DTSAPIUpdate: {
    copy: (
      <>
        <b>Updates are coming soon!</b>
        <ul className={updateList}>
          <li>The Daily Treasury Statement (DTS) dataset will be updated to match the published DTS.</li>
          <li>All DTS API endpoints will be renamed to show DTS table names.</li>
          <li>The Federal Tax Deposits and Short-Term Cash Investments tables will contain historical data only (through Feb. 13, 2023).</li>
          <li>There will be a new API endpoint for the Inter-Agency Tax Transfers table, which started on Feb. 14, 2023.</li>
        </ul>
      </>
    ),
  },
  TOPLimitedData: {
    copy: (
      <>
        <div className={columnFlex}>
          <b className={altBannerHeader}>This dataset is currently limited to data prior to 12/15/2022.</b>
          <span>
            The Fiscal Data team is working to resume the monthly update cadence. For more information about this data, please contact our team at{' '}
            <CustomLink url={'mailto:fiscaldata@fiscal.treasury.gov'}>fiscaldata@fiscal.treasury.gov</CustomLink> for assistance.
          </span>
        </div>
      </>
    ),
  },
  TextFilterDisabled: {
    copy: <>Text filtering has been limited due to large table size</>,
    infoTip: (
      <>
        Text filtering for data tables with more than 20,000 rows is currently not supported. You can shorten the date range to enable text filtering,
        or download the data for full filtering capabilities.
      </>
    ),
    customTextMargin: '0.5rem 0',
    customSideMargin: '1.5rem',
  },
};
