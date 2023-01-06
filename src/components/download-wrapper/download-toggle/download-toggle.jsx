import React, {useState} from 'react';
import * as styles from './download-toggle.module.scss';

const DownloadToggle = ({onChange}) => {
  const [activeState, setActiveState] = useState('csv');

  const changeState = (value) => {
    setActiveState(value);
    onChange(value);
  };

  return (
    <div className={styles.buttonGroup} data-toggle="buttons">
      <input
        type="radio"
        checked={activeState === 'csv' ? 'checked' : ''}
        className={styles.radio}
        value="csv"
        id="csv"
        name="downloadToggle"
        onChange={() => changeState('csv')}
      />
      <label
        className={`${styles.toggleButton} ${activeState === 'csv' ? styles.selected : ''}`}
        htmlFor="csv"
      >
        CSV
      </label>
      <input 
        type="radio"
        checked={activeState === 'json' ? 'checked' : ''}
        className={styles.radio}
        value="json"
        id="json"
        name="downloadToggle"
        onChange={() => changeState('json')}
      />
      <label
        className={`${styles.toggleButton} ${activeState === 'json' ? styles.selected : ''}`}
        htmlFor="json"
      >
        JSON
      </label>
      <input 
        type="radio"
        checked={activeState === 'xml' ? 'checked' : ''}
        className={styles.radio}
        value="xml"
        id="xml"
        name="downloadToggle"
        onChange={() => changeState('xml')}
      />
      <label
        className={`${styles.toggleButton} ${activeState === 'xml' ? styles.selected : ''}`}
        htmlFor="xml"
      >
        XML
      </label>
    </div>

  )
}

export default DownloadToggle;
