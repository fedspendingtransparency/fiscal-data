import React, { useState } from 'react';
import { buttonGroup, radio, selected, tabIcon, toggleButton } from './chart-table-toggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';

const ChartTableToggle = ({ onChange }) => {
  const [activeState, setActiveState] = useState('table');

  const changeState = value => {
    setActiveState(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={buttonGroup} data-toggle="buttons">
      <input
        type="radio"
        checked={activeState === 'table' ? 'checked' : ''}
        className={radio}
        value="table"
        id="table"
        name="downloadToggle"
        onChange={() => changeState('table')}
      />
      <label className={`${toggleButton} ${activeState === 'table' ? selected : ''}`} htmlFor="table">
        <FontAwesomeIcon icon={faTable} size="1x" className={tabIcon} />
        Table
      </label>
      <input
        type="radio"
        checked={activeState === 'chart' ? 'checked' : ''}
        className={radio}
        value="chart"
        id="chart"
        name="downloadToggle"
        onChange={() => changeState('chart')}
      />
      <label className={`${toggleButton} ${activeState === 'chart' ? selected : ''}`} htmlFor="chart">
        <FontAwesomeIcon icon={faChartBar} size="1x" className={tabIcon} />
        Chart
      </label>
    </div>
  );
};

export default ChartTableToggle;
