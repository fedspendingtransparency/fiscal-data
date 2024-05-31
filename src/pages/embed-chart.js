import React from 'react';
import HowSavingsBondsSoldChart from '../layouts/explainer/sections/treasury-savings-bonds/how-savings-bonds-finance-government/how-savings-bonds-finance-chart/how-savings-bonds-sold-chart';
import AFGDebtChart from '../layouts/explainer/sections/overview/debt-chart/debt-chart';
import Experimental from '../components/experimental/experimental';

const EmbedChartPage = () => {
  const chartData = [
    { name: 'Marketable', value: 60, percent: 60, securityType: 'Marketable' },
    { name: 'Nonmarketable', value: 40, percent: 40, securityType: 'Nonmarketable' },
  ];
  return (
    <Experimental exclude={true}>
      <div style={{ width: '100%', height: '100vh' }}>
        <AFGDebtChart />
      </div>
    </Experimental>
  );
};

export default EmbedChartPage;
