import { deficitExplainerPrimary } from '../../../../../variables.module.scss';
import React from 'react';
import { visWithCallout } from '../../../explainer.module.scss';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import CustomLink from '../../../../../components/links/custom-link/custom-link';
import DeficitTrendsBarChart from './deficit-trends-bar-chart/deficit-trends-bar-chart';
import { explainerCitationsMap } from '../../../explainer-helpers/explainer-helpers';

const DeficitByYear = () => {
  const { USAsCovidResponse } = explainerCitationsMap['national-deficit'];

  const federalSpendingLink = (
    <CustomLink url="/americas-finance-guide/federal-spending/" id="Federal Spending">
      federal spending
    </CustomLink>
  );

  const federalRevenueLink = (
    <CustomLink url="/americas-finance-guide/government-revenue/" id="Government Revenue">
      federal revenue
    </CustomLink>
  );

  return (
    <>
      <div>
        <p>
          Since 2001, the federal government’s budget has run a deficit each year. Starting in 2016, increases in spending on Social Security, health
          care, and interest on federal debt have outpaced the growth of {federalRevenueLink}.
        </p>
        <p>
          From FY 2019 to FY 2021, {federalSpendingLink} increased by about 50 percent {USAsCovidResponse}.
        </p>
      </div>
      <figure className={visWithCallout}>
        <DeficitTrendsBarChart />
        <VisualizationCallout color={deficitExplainerPrimary}>
          <p>The last surplus for the federal government was in 2001.</p>
        </VisualizationCallout>
      </figure>
    </>
  );
};

export default DeficitByYear;
