import React from 'react';
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
