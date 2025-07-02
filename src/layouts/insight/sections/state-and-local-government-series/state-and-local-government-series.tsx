import React from 'react';
import { BodyCopy } from './body-copy/body-copy';
import { StateAndLocalGovernmentSeriesChart } from './state-and-local-government-series-chart/state-and-local-government-series-chart';

export const stateLocalGovernmentSeriesDataSources = (
  <>
    Visit the ABC and XYZ datasets to explore and download this data. The interest expense reflects the sum of all interest paid on the debt for each
    fiscal year or through the latest month of the latest fiscal year. The average interest rate is the average of all interest rates on outstanding
    securities for the last month of each fiscal year or the most recent month with available data. Because this rate is an average of rates paid on
    various security types, the interest expense cannot be determined by multiplying the average interest rate by the outstanding debt.
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
