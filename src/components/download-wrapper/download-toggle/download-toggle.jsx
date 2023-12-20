import React, { useState } from 'react';
import { buttonGroup, radio, toggleButton, selected } from './download-toggle.module.scss';

const DownloadToggle = ({ onChange }) => {
  const [activeState, setActiveState] = useState('csv');

  const changeState = value => {
    setActiveState(value);
    onChange(value);
  };

  return (
    <div className={buttonGroup} data-toggle="buttons">
      <input
        type="radio"
        checked={activeState === 'csv' ? 'checked' : ''}
        className={radio}
        value="csv"
        id="csv"
        name="downloadToggle"
        onChange={() => changeState('csv')}
      />
      <label className={`${toggleButton} ${activeState === 'csv' ? selected : ''}`} htmlFor="csv">
        CSV
      </label>
      <input
        type="radio"
        checked={activeState === 'json' ? 'checked' : ''}
        className={radio}
        value="json"
        id="json"
        name="downloadToggle"
        onChange={() => changeState('json')}
      />
      <label className={`${toggleButton} ${activeState === 'json' ? selected : ''}`} htmlFor="json">
        JSON
      </label>
      <input
        type="radio"
        checked={activeState === 'xml' ? 'checked' : ''}
        className={radio}
        value="xml"
        id="xml"
        name="downloadToggle"
        onChange={() => changeState('xml')}
      />
      <label className={`${toggleButton} ${activeState === 'xml' ? selected : ''}`} htmlFor="xml">
        XML
      </label>
    </div>
  );
};

export default DownloadToggle;
