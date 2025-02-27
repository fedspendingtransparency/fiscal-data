import React from 'react';
import {
  interestExpenseChartToggleContainer,
  toggleButton,
  toggleButtonLeft,
  toggleButtonRight,
  selected,
  icon,
} from './interest-expense-chart-toggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
const InterestExpenseChartToggle = ({ toggleClickHandler, primaryColor, chartId, leftButtonConfig, rightButtonConfig }) => {
  const { leftId, leftSelected } = leftButtonConfig;
  const { rightId, rightSelected } = rightButtonConfig;
  return (
    <div className={interestExpenseChartToggleContainer}>
      <button
        className={`${toggleButton} ${toggleButtonRight} ${leftSelected ? selected : null}`}
        onClick={() => {
          toggleClickHandler(leftId);
        }}
        style={{
          background: leftSelected ? primaryColor : '#FFF',
          color: leftSelected ? '#FFF' : primaryColor,
          borderColor: primaryColor,
        }}
        id={chartId}
      >
        <FontAwesomeIcon className={icon} icon={faChartColumn} />
      </button>
      <button
        className={`${toggleButton} ${toggleButtonLeft} ${rightSelected ? selected : null}`}
        onClick={() => {
          toggleClickHandler(rightId);
        }}
        style={{
          background: rightSelected ? primaryColor : '#FFF',
          color: rightSelected ? '#FFF' : primaryColor,
          borderColor: primaryColor,
        }}
        id={chartId}
      >
        <FontAwesomeIcon className={icon} icon={faTable} />
      </button>
    </div>
  );
};

export default InterestExpenseChartToggle;
