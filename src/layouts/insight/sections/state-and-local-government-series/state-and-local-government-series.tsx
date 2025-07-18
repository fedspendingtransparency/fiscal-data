import React from 'react';
import BodyCopy from './body-copy/body-copy';
import StateAndLocalGovernmentSeriesChart from './state-and-local-government-series-chart/state-and-local-government-series-chart';
import { insightsCitationsMap } from '../../../../helpers/insights/insight-helpers';

const { stateAndLocalGovernmentSeriesSecuritiesDataset, debtToThePennyDataset } = insightsCitationsMap['state-and-local-government-series'];

export const stateLocalGovernmentSeriesDataSources = (
  <>
    Visit the {stateAndLocalGovernmentSeriesSecuritiesDataset} dataset to explore and download the data. The amount and count of outstanding
    securities are the sum of outstanding securities across all maturities that have yet to mature or be redeemed for the period. Values are reflected
    for the last day of month shown. Visit the {debtToThePennyDataset} dataset to explore total outstanding debt.
  </>
);

const stateLocalGovernmentSeriesSections = [
  {
    index: 0,
    component: <BodyCopy />,
  },
  {
    index: 1,
    component: <StateAndLocalGovernmentSeriesChart />,
  },
];

export default stateLocalGovernmentSeriesSections;
