import React, { ReactElement } from 'react';
import { featuredContentCitationsMap } from '../../featured-content-helpers';
import ContentTable, { ContentTableColumn } from '../../../../components/content-table/content-table';

const datasetChangesColumns: ContentTableColumn[] = [
  {
    header: 'Dataset',
    cells: ['Treasury Securities Auctions Data', 'Treasury Securities Auctions Data', 'FRN Daily Indexes', 'Upcoming Auctions', 'TIPs and CPI'],
    urls: [
      '/datasets/treasury-securities-auctions-data/',
      '/datasets/treasury-securities-auctions-data/',
      '/datasets/frn-daily-indexes/',
      '/datasets/upcoming-auctions/',
      '/datasets/tips-cpi-data/reference-cpi-numbers-and-daily-index-ratios-summary-table-updated',
    ],
  },
  {
    header: 'Table',
    cells: [
      'Treasury Securities Auctions Data',
      'Treasury Securities Interest Payments',
      'FRN Daily Indexes',
      'Treasury Securities Upcoming Auctions',
      'Reference CPI Numbers and Daily Index Ratios Summary',
    ],
  },
  {
    header: 'Summary of Changes',
    cells: [
      'Over 70 new fields, field name changes',
      'New data table',
      'New XML file, field name changes',
      'Field Name Changes',
      'Field Name Changes',
    ],
  },
];

export const TreasuryAuctionsDataBody = (): ReactElement => {
  const { treasurySecuritiesAuctionsDataLink, frnDailyIndexesLink, upcomingAuctions, tipsAndCpi } = featuredContentCitationsMap[
    'treasury-auctions-data'
  ];

  return (
    <div>
      <p>
        To provide more reliable and comprehensive data, four Treasury Securities Auctions datasets have been updated, and a completely new data table
        within the Treasury Securities Auctions Dataset will be added soon. The new Treasury Securities Interest Payments data table and API will
        provide more granular detail on interest payment dates for Separate Trading of Registered Interest and Principal of Securities (STRIPS) CUSIP
        values. Additionally, the {treasurySecuritiesAuctionsDataLink} table now includes more than 70 new fields that give users additional amounts,
        rates, and yields. {frnDailyIndexesLink}, {upcomingAuctions}, and {tipsAndCpi} datasets have field name changes that could impact users who
        regularly pull data via the API.{' '}
      </p>
      <p>
        New APIs have been created for each of the four impacted datasets to accommodate these changes. Field names and descriptions are available
        within each dataset’s Data Dictionary and Metadata, which can be found in the Dataset Properties section of the dataset page. The new APIs for
        each dataset will include data beginning with October 1, 2026. Historical data will be added soon. To aid in the transition to the new APIs
        and data tables, the old APIs will continue to be available until spring 2027. A summary of the changes is included below:{' '}
      </p>
      <ContentTable columns={datasetChangesColumns} data-testid="treasury-auctions-changes-table" />
    </div>
  );
};
