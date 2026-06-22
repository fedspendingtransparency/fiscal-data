import React, { FunctionComponent } from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import PageHelmet from '../../components/page-helmet/page-helmet';
import CustomLink from '../../components/links/custom-link/custom-link';
import InflationCalculator from '../experimental/inflation/inflation-calculator';
import { pageContainer, relatedResources, resourceItem, resourceList, sourceNote } from './inflation-calculator-page.module.scss';

interface IRelatedResource {
  title: string;
  url: string;
  description: string;
}

const RELATED_RESOURCES: IRelatedResource[] = [
  {
    title: 'Currency Exchange Rates Converter',
    url: '/currency-exchange-rates-converter/',
    description: 'Convert between U.S. dollars and foreign currencies using the U.S. Treasury reporting rates of exchange.',
  },
  {
    title: "America's Finance Guide",
    url: '/americas-finance-guide/',
    description: 'See how the federal government raises and spends money, and how those figures have changed over time.',
  },
  {
    title: 'Consumer Price Index (CPI) — U.S. Bureau of Labor Statistics',
    url: 'https://www.bls.gov/cpi/',
    description: 'The official source of the CPI data this calculator uses to measure inflation.',
  },
  {
    title: 'Series I Savings Bonds — TreasuryDirect',
    url: 'https://www.treasurydirect.gov/savings-bonds/i-bonds/',
    description: 'Savings bonds with an interest rate that adjusts for inflation to help protect purchasing power.',
  },
];

const InflationCalculatorPage: FunctionComponent = () => {
  return (
    <SiteLayout isPreProd={false}>
      <div className="pageHeader">
        <div className="content">
          <h1 className="title">Inflation Calculator</h1>
        </div>
      </div>
      <div className={pageContainer}>
        <InflationCalculator />

        <section className={relatedResources}>
          <h2>Related Resources</h2>
          <ul className={resourceList}>
            {RELATED_RESOURCES.map(resource => (
              <li key={resource.url} className={resourceItem}>
                <CustomLink url={resource.url}>{resource.title}</CustomLink>
                <p>{resource.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <p className={sourceNote}>
          Calculations are based on the annual average Consumer Price Index for All Urban Consumers (CPI-U) published by the{' '}
          <CustomLink url="https://www.bls.gov/cpi/">U.S. Bureau of Labor Statistics</CustomLink>. Figures are estimates intended for general
          reference and may differ from other inflation measures.
        </p>
      </div>
    </SiteLayout>
  );
};

export default InflationCalculatorPage;

export const Head = () => (
  <PageHelmet
    pageTitle="Inflation Calculator"
    description={
      'Use the Inflation Calculator to see how the purchasing power of a U.S. dollar has changed between two years, ' +
      'based on the Consumer Price Index.'
    }
    descriptionGenerator={false}
    keywords="inflation calculator, consumer price index, cpi, purchasing power, us dollar value, cost of living"
  />
);
