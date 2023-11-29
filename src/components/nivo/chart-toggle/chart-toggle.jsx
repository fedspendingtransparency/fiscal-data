import React from 'react';
import {
  chartToggle,
  toggleButton,
  toggleButtonLeft,
  toggleButtonRight,
  selected,
  buttonTitle
} from './chart-toggle.module.scss';


const ChartToggle = ({toggleClickHandler, primaryColor, chartId,  leftButtonConfig, rightButtonConfig}) => {
  const {leftTitle, leftId, leftSelected} = leftButtonConfig;
  const {rightTitle, rightId, rightSelected} = rightButtonConfig;

  return (
    <div className={chartToggle}>
      <button
        className={`${toggleButton} ${toggleButtonRight} ${leftSelected ? selected : null}`}
        style={{
          background: leftSelected ? primaryColor : '#f1f1f1',
          color: leftSelected ? '#ffffff' : primaryColor,
          borderColor: primaryColor
        }}
        onClick={() => {toggleClickHandler(leftId)}}
        id={chartId}
      >
          <span className={buttonTitle}>
            {leftTitle}
          </span>
      </button>
      <button
        className={`${toggleButton} ${toggleButtonLeft} ${rightSelected ? selected : null}`}
        style={{
          background: rightSelected ? primaryColor : '#f1f1f1',
          color: rightSelected ? '#ffffff' : primaryColor,
          borderColor: primaryColor
        }}
        onClick={() => {toggleClickHandler(rightId)}}
        id={chartId}
      >
          <span className={buttonTitle}>
            {rightTitle}
          </span>
      </button>
    </div>
  )
}

export default ChartToggle;
