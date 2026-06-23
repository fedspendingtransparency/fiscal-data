import React, { ReactElement } from 'react';
import { featuredContentCitationsMap } from '../../featured-content-helpers';

export const StoryOfDataTransparencyBody = (): ReactElement => {
  const {
    accountsOfReceiptsAndExpendituresDataset,
    federalFundingAccountabilityAct,
    digitalAccountabilityAndTransparencyAct,
    usaSpending,
    combinedStatementDataset,
    monthlyTreasuryStatementDataset,
    historicalDebtOutstandingDataset,
    debtLink,
    spendingLink,
    revenueLink,
    deficitLink,
  } = featuredContentCitationsMap['story-of-data-transparency'];

  return (
    <div>
      <p>
        In the very Constitution of the United States, it was written that “a regular Statement and Account of the Receipts and Expenditures of all
        public Money shall be published from time to time.” This became one of the first public financial reports, with the{' '}
        {accountsOfReceiptsAndExpendituresDataset} published from 1793 through 1890. In these historical files, now available on Fiscal Data, you can
        see the transfer of funds from the “Revolutionary Government”, the first expenses for the United States Navy, payments from the Louisiana
        Purchase, and spending on costs for civil goods such as hospitals, roads, and light houses.{' '}
      </p>
      <p>
        Over time, both the volume of financial reports and the standards and requirements for when and how the government tracked its finances
        evolved. In 1921, the Budget and Accounting Act mandated the first annual, consolidated budget system and required independent audits. In the
        1990s, additional governance and oversight was established, including the first Government Accountability Office (GAO) audit of the Treasury.
        Significant advancements in transparency for federal finances were made with the {federalFundingAccountabilityAct} and the{' '}
        {digitalAccountabilityAndTransparencyAct}. These Congressional Acts required the government to expand the amount of data available to the
        public to provide greater visibility into how tax dollars are spent through {usaSpending}.{' '}
      </p>
      <p>
        Fiscal Data stands in this long history of federal financial transparency. The site pulls together federal financial reports, like{' '}
        {accountsOfReceiptsAndExpendituresDataset}, {combinedStatementDataset}, and the {monthlyTreasuryStatementDataset}, which together make up
        nearly 250 years of data on the government’s revenue, spending, and deficits. Additional reports, like the {historicalDebtOutstandingDataset}{' '}
        provide debt data beginning in 1790. In one consolidated location, many of these reports now include machine-readable data for easier analysis
        by the public and greater information about reports. Additionally, Fiscal Data includes explainers about the {debtLink}, {spendingLink},{' '}
        {revenueLink}, {deficitLink}, and other topics to make federal financial information not only accessible, but more understandable for the
        American Public.{' '}
      </p>
    </div>
  );
};
