import React from 'react';
import InterestExpenseChartToggle from '../interest-expense-chart-toggle/interest-expense-chart-toggle';
import { interestExpenseChartHeaderContainer } from './interestExpense-chart-header.module.scss';
const InterestExpenseChartHeader = ({ selectedChartView, setSelectedChartView }) => {
  return (
    <div className={interestExpenseChartHeaderContainer}>
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
        toggleClickHandler={chartView => setSelectedChartView(chartView)}
        chartId={null}
      />
    </div>
  );
};

export default InterestExpenseChartHeader;
