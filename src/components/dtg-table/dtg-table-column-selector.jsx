import React from 'react';
import Checkbox from '../checkbox/checkbox';
import SelectAll from '../select-all/selectAll';
import * as styles from './dtg-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUndo } from '@fortawesome/free-solid-svg-icons';

  // FIX TABBING

const DtgTableColumnSelector = ({ fields, isVisible, onChange, resetToDefault, setSelectColumnPanel }) => (
  <section>
    <div className={styles.headingWrapper}>
      <div className={styles.heading}>
        <div className={styles.title}>Visible Columns</div>
        {/* use ref in glossary panel */}
        <button onClick={() => setSelectColumnPanel(false)} 
                onKeyPress={() => setSelectColumnPanel(false)} 
                className={styles.closeButton} 
                aria-label={'Close select control panel'}>
            <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
        </button>
      </div>
      <div className={styles.selectedValues}>{fields.filter(field => field.active === true).length} selected of {fields.length}</div>
    </div>
    <div className={styles.selectAllContainer}>


      <SelectAll
        className={styles.selectAllColumns}
        fields={fields}
        isVisible={isVisible}
        onUpdateFields={onChange}
      />
      <button className={styles.reset} onClick={resetToDefault}>
        <FontAwesomeIcon className={styles.resetIcon} icon={faUndo} />
        Reset
      </button>
    </div>
    <div className={styles.buttonContainer}>
      <Checkbox
        checkboxData={(fields.filter(field => field.default === true))
          .concat(fields.filter(field => field.default !== true))}
        changeHandler={onChange}
      />
    </div>
  </section>
);

export default DtgTableColumnSelector;