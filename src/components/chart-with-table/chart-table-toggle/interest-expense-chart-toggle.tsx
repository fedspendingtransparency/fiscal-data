import React from 'react';
import {
  interestExpenseChartToggleContainer,
  toggleButton,
  toggleButtonLeft,
  toggleButtonRight,
  selected,
  icon,
} from './chart-table-toggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faTable } from '@fortawesome/free-solid-svg-icons';
interface LeftButtonConfig {
  leftId: string;
  leftSelected: boolean;
}

interface RightButtonConfig {
  rightId: string;
  rightSelected: boolean;
}

interface InterestExpenseChartToggleProps {
  toggleClickHandler: (id: string) => void;
  primaryColor: string;
  chartId: string | null;
  leftButtonConfig: LeftButtonConfig;
  rightButtonConfig: RightButtonConfig;
}

const InterestExpenseChartToggle: React.FC<InterestExpenseChartToggleProps> = ({
  toggleClickHandler,
  primaryColor,
  chartId,
  leftButtonConfig,
  rightButtonConfig,
}) => {
  const { leftId, leftSelected } = leftButtonConfig;
  const { rightId, rightSelected } = rightButtonConfig;
  return (
    <div className={interestExpenseChartToggleContainer}>
      <button
        className={`${toggleButton} ${toggleButtonRight} ${leftSelected ? selected : ''}`}
        onClick={() => {
          toggleClickHandler(leftId);
        }}
        style={{
          background: leftSelected ? primaryColor : '#FFF',
          color: leftSelected ? '#FFF' : primaryColor,
          borderColor: primaryColor,
        }}
        id={chartId || undefined}
      >
        <FontAwesomeIcon className={icon} icon={faChartColumn} />
      </button>
      <button
        className={`${toggleButton} ${toggleButtonLeft} ${rightSelected ? selected : ''}`}
        onClick={() => {
          toggleClickHandler(rightId);
        }}
        style={{
          background: rightSelected ? primaryColor : '#FFF',
          color: rightSelected ? '#FFF' : primaryColor,
          borderColor: primaryColor,
        }}
        id={chartId || undefined}
      >
        <FontAwesomeIcon className={icon} icon={faTable} />
      </button>
    </div>
  );
};

export default InterestExpenseChartToggle;
