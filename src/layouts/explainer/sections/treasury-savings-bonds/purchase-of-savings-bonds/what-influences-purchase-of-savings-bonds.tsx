import React, { FunctionComponent } from 'react';
import SavingsBondsSoldByTypeChart from './savings-bonds-sold-by-type-chart/savings-bonds-sold-by-type-chart';
import VisualizationCallout from '../../../../../components/visualization-callout/visualization-callout';
import { visWithCallout } from '../../../explainer.module.scss';
import { treasurySavingsBondsExplainerSecondary } from '../treasury-savings-bonds.module.scss';
const WhatInfluencesPurchaseOfSavingsBonds: FunctionComponent = () => {
  return (
    <>
      <p>The chart below shows savings bond sales over time for all XX(number of bond types) savings bond types and their relative popularity.</p>
      <div className={visWithCallout}>
        <SavingsBondsSoldByTypeChart />
        <VisualizationCallout color={treasurySavingsBondsExplainerSecondary}>
          <p>
            Savings bonds were most popular in YYYY (year of most sales) and YYYY (year of second most sales) when ## and ## bonds were sold,
            respectively.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
};

export default WhatInfluencesPurchaseOfSavingsBonds;
