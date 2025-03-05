import React from 'react';
import InterestExpenseChartToggle from '../chart-table-toggle/interest-expense-chart-toggle';

interface InterestExpenseChartHeaderProps {
  selectedChartView: string;
  setSelectedChartView: (chartView: string) => void;
}
const InterestExpenseChartHeader: React.FC<InterestExpenseChartHeaderProps> = ({ selectedChartView, setSelectedChartView }) => {
  return (
    <div>
      <InterestExpenseChartToggle
        primaryColor={'#0071BC'}
        leftButtonConfig={{
          leftId: 'chartView',
          leftSelected: selectedChartView === 'chartView',
        }}
        rightButtonConfig={{
          rightId: 'tableView',
          rightSelected: selectedChartView === 'tableView',
        }}
        toggleClickHandler={(chartView: string) => setSelectedChartView(chartView)}
        chartId={null}
      />
    </div>
  );
};

export default InterestExpenseChartHeader;
