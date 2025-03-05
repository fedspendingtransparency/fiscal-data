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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
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
  leftIcon: IconDefinition;
  rightIcon: IconDefinition;
}

const ChartTableToggle: React.FC<InterestExpenseChartToggleProps> = ({
  toggleClickHandler,
  primaryColor,
  chartId,
  leftButtonConfig,
  rightButtonConfig,
  leftIcon,
  rightIcon,
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
        <FontAwesomeIcon className={icon} icon={leftIcon} />
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
        <FontAwesomeIcon className={icon} icon={rightIcon} />
      </button>
    </div>
  );
};

export default ChartTableToggle;
