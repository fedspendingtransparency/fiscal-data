import React from 'react';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { datasetSectionConfig, explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';
import { KeyTakeawaysSection } from './key-takeaways/national-debt-key-takeaways';
import DiveDeeperIntoTheDebt from './dive-deeper-into-the-debt/dive-deeper-into-the-debt';
import NationalDebtExplained from './national-debt-explained/national-debt-explained';
import BreakingDownTheDebt from './breaking-down-the-debt/breaking-down-the-debt';
import { GrowingNationalDebtSection } from './growing-national-debt/growing-national-debt';
import DebtCeilingSection from './debt-ceiling/debt-ceiling';
import FundingProgramsAndServices from './funding-programs-and-services/funding-programs-and-services';
import TrackingTheDebt from './tracking-the-debt/tracking-the-debt';

export const nationalDebtSectionConfigs = datasetSectionConfig['national-debt'];

export const nationalDebtSectionIds = [
  'key-takeaways',
  'the-national-debt-explained',
  'funding-programs-and-services',
  'the-growing-national-debt',
  'breaking-down-the-debt',
  'the-debt-ceiling',
  'tracking-the-debt',
  'dive-deeper-into-the-debt',
];

export const visualizingTheDebtTableContent = {
  desktop: {
    rows: 20,
    columns: 50,
  },
  mobile: {
    rows: 50,
    columns: 20,
  },
};

export const chartPatternBackground = '#4A0072';

export const percentageFormatter = value => (Math.round(Number(value) * 100).toPrecision(15) / 100).toFixed(2) + '%';
export const trillionsFormatter = value => `$${(Number(value) / 1000000).toFixed(2)} T`;

const nationalDebtSections = [
  {
    index: 0,
    id: nationalDebtSectionIds[0],
    title: 'Key Takeaways',
    component: cpiData => <KeyTakeawaysSection />,
  },
  {
    index: 1,
    id: nationalDebtSectionIds[1],
    title: 'The National Debt Explained',
    component: cpiData => <NationalDebtExplained />,
  },
  {
    index: 2,
    id: nationalDebtSectionIds[2],
    title: 'Funding Programs and Services',
    component: cpiData => <FundingProgramsAndServices />,
  },
  {
    index: 3,
    id: nationalDebtSectionIds[3],
    title: 'The Growing National Debt',
    component: cpiData => <GrowingNationalDebtSection sectionId={nationalDebtSectionIds[3]} cpiDataByYear={cpiData.cpiDataByYear} />,
  },
  {
    index: 4,
    id: nationalDebtSectionIds[4],
    title: 'Breaking Down the Debt',
    component: cpiData => <BreakingDownTheDebt sectionId={nationalDebtSectionIds[4]} />,
  },
  {
    index: 5,
    id: nationalDebtSectionIds[5],
    title: 'The Debt Ceiling',
    component: cpiData => <DebtCeilingSection />,
  },
  {
    index: 6,
    id: nationalDebtSectionIds[6],
    title: 'Tracking the Debt',
    component: cpiData => <TrackingTheDebt />,
  },
  {
    index: 7,
    id: nationalDebtSectionIds[7],
    title: 'Dive Deeper into the Debt',
    component: cpiData => <DiveDeeperIntoTheDebt />,
  },
];

export default nationalDebtSections;

const { bea, bls, github, mspd, debtToThePenny, historicalDebt, treasuryDirectHistoricalDebt, treasurySecurities } = explainerCitationsMap[
  'national-debt'
];

export const nationalDebtDataSources = (
  <>
    Three different Fiscal Data datasets are used for federal debt values on this page. {debtToThePenny} provides daily values; values from the
    December {mspd} are used for visualizations showing calendar years; and {historicalDebt} provides an annual value for fiscal years. Interest rates
    are pulled from the {treasurySecurities} dataset. Adjustments for inflation are calculated using Consumer Price Index (CPI) values from the {bls}.
    If CPI data is delayed or missing, the latest available value for the given month is used. Fiscal year Gross Domestic Product values from the{' '}
    {bea} are calculated by averaging four relevant quarterly values from calendar year quarter 4 of the prior year through calendar year quarter 3 of
    the fiscal year shown. For detailed documentation, users can reference our {github}. For more information on the {treasuryDirectHistoricalDebt},
    visit TreasuryDirect.
  </>
);

// export for use in tests
export const nationalDebtDescriptionAppendix = 'Learn how the national debt works and how it impacts you.';

export const nationalDebtDescriptionGenerator = () => {
  const fields = 'fields=tot_pub_debt_out_amt,record_date';
  const sort = 'sort=-record_date';
  const pagination = 'page[size]=1&page[number]=1';
  const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl = `${apiPrefix}${endpointUrl}`;
  return basicFetch(debtUrl).then(res => {
    let seoDescription = nationalDebtDescriptionAppendix;
    if (res && res.data) {
      const amount = '$' + (Number(res.data[0]['tot_pub_debt_out_amt']) / 1000000000000).toFixed(2);
      seoDescription = `The federal government currently has ${amount} trillion in federal debt. ` + seoDescription;
    }
    return seoDescription;
  });
};
