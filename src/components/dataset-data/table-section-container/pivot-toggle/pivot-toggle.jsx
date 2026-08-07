import React from 'react';
import { headerToggle, toggleIcon } from './pivot-toggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-regular-svg-icons/faChartBar';

const PivotToggle = ({ clickHandler, open }) => {
  return (
    <button
      className={headerToggle}
      data-testid={open ? 'hide-pivot-options' : 'show-pivot-options'}
      onClick={clickHandler}
      aria-haspopup
      aria-expanded={open}
    >
      <FontAwesomeIcon icon={faChartBar} className={toggleIcon} data-testid="bar-chart-icon" size="1x" />
      <span data-testid="toggleText">{open ? 'Hide ' : 'Show '} Pivot Options</span>
    </button>
  );
};
export default PivotToggle;
