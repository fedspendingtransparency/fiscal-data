import React from 'react';
import { buttonTitle, chartToggle, selected, toggleButton, toggleButtonLeft, toggleButtonRight } from './chart-toggle.module.scss';

const ChartToggle = ({ toggleClickHandler, primaryColor, secondaryColor, chartId, leftButtonConfig, rightButtonConfig }) => {
  const { leftTitle, leftId, leftSelected } = leftButtonConfig;
  const { rightTitle, rightId, rightSelected } = rightButtonConfig;

  return (
    <div className={chartToggle}>
      <button
        data-testid="leftChartToggle"
        className={`${toggleButton} ${toggleButtonRight} ${leftSelected ? selected : null}`}
        style={{
          background: leftSelected ? primaryColor : '#f1f1f1',
          color: leftSelected ? '#ffffff' : secondaryColor,
          borderColor: primaryColor,
        }}
        onClick={() => {
          toggleClickHandler(leftId);
        }}
        id={chartId}
      >
        <span className={buttonTitle}>{leftTitle}</span>
      </button>
      <button
        className={`${toggleButton} ${toggleButtonLeft} ${rightSelected ? selected : null}`}
        style={{
          background: rightSelected ? primaryColor : '#f1f1f1',
          color: rightSelected ? '#ffffff' : secondaryColor,
          borderColor: primaryColor,
        }}
        onClick={() => {
          toggleClickHandler(rightId);
        }}
        id={chartId}
      >
        <span className={buttonTitle}>{rightTitle}</span>
      </button>
    </div>
  );
};

export default ChartToggle;
