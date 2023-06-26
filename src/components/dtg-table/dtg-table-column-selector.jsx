import React from 'react';
import Checkbox from '../checkbox/checkbox';
import SelectAll from '../select-all/selectAll';
import * as styles from './dtg-table-column-selector.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUndo } from '@fortawesome/free-solid-svg-icons';

const DtgTableColumnSelector = ({ fields, isVisible, onChange }) => (
  <section>
    <div className={styles.headingWrapper}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Visible Columns</h1>
        {/* use ref in glossary panel */}
        <button onClick={console.log("CLICK")} 
                onKeyPress={console.log("CLICK")} 
                className={styles.closeButton} 
                aria-label={'Close select control panel'}>
            <FontAwesomeIcon icon={faXmark} className={styles.closeIcon} />
        </button>
      </div>
      <div className={styles.selectedValues}>X selected of XXX</div>
    </div>
    <div className={styles.selectAllContainer}>
      <SelectAll
      className={styles.selectAllColumns}
        fields={fields}
        isVisible={isVisible}
        onUpdateFields={onChange}
      />
      <div className={styles.reset}>
        <FontAwesomeIcon className={styles.resetIcon} icon={faUndo} />
        Reset
      </div>
    </div>
    
    {/* // clicking between default and additional clears the other section out
    probs bc they are seperate instances of the same component */}

    <div className={styles.buttonContainer}>
      <div className={styles.checkboxHeading}>DEFAULTS</div>
      <div className={styles.defaultSection}>
        <Checkbox
            checkboxData={fields.filter(field => field.default === true)}
            changeHandler={onChange}
            // onHover={console.log("UPDATE HOVER")}
        />
      </div>
      

      <div className={styles.checkboxHeading}>ADDITIONAL</div>
        <Checkbox
          checkboxData={fields.filter(field => field.default === false)}
          changeHandler={onChange}
          // onHover={onChange}
        />
    </div>
  </section>
);

export default DtgTableColumnSelector;