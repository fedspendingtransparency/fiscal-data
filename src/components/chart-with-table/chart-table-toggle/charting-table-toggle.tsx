import React, { FunctionComponent } from 'react';
import { chartTableToggleContainer, icon, selected, toggleButton, toggleButtonLeft, toggleButtonRight } from './charting-table-toggle.module.scss';
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

const ChartingTableToggle: FunctionComponent<InterestExpenseChartToggleProps> = ({
  gaChartTableToggleEvent,
  toggleClickHandler,
  primaryColor,
  chartId,
  leftButtonConfig,
  rightButtonConfig,
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
}) => {
  const { leftId, leftSelected } = leftButtonConfig;
  const { rightId, rightSelected } = rightButtonConfig;
  return (
    <div className={chartTableToggleContainer}>
      <button
        className={`${toggleButton} ${toggleButtonRight} ${leftSelected ? selected : ''}`}
        data-testid="toggleButtonLeft"
        onClick={() => {
          toggleClickHandler(leftId);
          if (typeof gaChartTableToggleEvent === 'function') {
            gaChartTableToggleEvent();
          }
        }}
        style={{
          background: leftSelected ? primaryColor : '#FFF',
          color: leftSelected ? '#FFF' : primaryColor,
        }}
        id={chartId || undefined}
        aria-label={leftLabel}
      >
        <FontAwesomeIcon className={icon} icon={leftIcon} />
      </button>
      <button
        className={`${toggleButton} ${toggleButtonLeft} ${rightSelected ? selected : ''}`}
        data-testid="toggleButtonRight"
        onClick={() => {
          toggleClickHandler(rightId);
          if (typeof gaChartTableToggleEvent === 'function') {
            gaChartTableToggleEvent();
          }
        }}
        style={{
          background: rightSelected ? primaryColor : '#FFF',
          color: rightSelected ? '#FFF' : primaryColor,
        }}
        id={chartId || undefined}
        aria-label={rightLabel}
      >
        <FontAwesomeIcon className={icon} icon={rightIcon} />
      </button>
    </div>
  );
};

export default ChartingTableToggle;
