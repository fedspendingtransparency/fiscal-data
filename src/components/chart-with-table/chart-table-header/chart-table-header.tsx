import React from 'react';
import ChartTableToggle from '../chart-table-toggle/charting-table-toggle';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
interface InterestExpenseChartHeaderProps {
  selectedChartView: string;
  setSelectedChartView: (chartView: string) => void;
  leftIcon: IconDefinition;
  rightIcon: IconDefinition;
}
const ChartTableHeader: React.FC<InterestExpenseChartHeaderProps> = ({ selectedChartView, setSelectedChartView, leftIcon, rightIcon }) => {
  return (
    <div>
      <ChartTableToggle
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
        leftIcon={leftIcon}
        rightIcon={rightIcon}
      />
    </div>
  );
};

export default ChartTableHeader;
