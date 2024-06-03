import React from 'react';
import HowSavingsBondsSoldChart from '../layouts/explainer/sections/treasury-savings-bonds/how-savings-bonds-finance-government/how-savings-bonds-finance-chart/how-savings-bonds-sold-chart';
import AFGDebtChart from '../layouts/explainer/sections/overview/debt-chart/debt-chart';
import Experimental from '../components/experimental/experimental';

const EmbedChartPage = () => {
  return (
    <Experimental exclude={true}>
      <div style={{ width: '100%', height: '100vh' }}>
        <AFGDebtChart />
      </div>
    </Experimental>
  );
};

export default EmbedChartPage;
