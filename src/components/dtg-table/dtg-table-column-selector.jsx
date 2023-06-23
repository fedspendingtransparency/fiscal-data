import React from 'react';
import Checkbox from '../checkbox/checkbox';
import SelectAll from '../select-all/selectAll';
import * as styles from './dtg-table-column-selector.module.scss';

const DtgTableColumnSelector = ({ fields, isVisible }) => (
  <section>
    <div className={styles.headingWrapper}>
      <h1 className={styles.heading}>Visible Columns</h1>
      <div className={styles.selectedValues}>X selected of XXX</div>
    </div>
    <SelectAll
      fields={fields}
      isVisible={isVisible}
      //onUpdateFields={console.log("UPDATE FIELD")}
    />
    <div className={styles.buttonContainer}>
      <div className={styles.checkboxHeading}>DEFAULTS</div>
      <div className={styles.defaultSection}>
        <Checkbox
            checkboxData={fields.filter(field => field.default === true)}
            // changeHandler={console.log("UPDATE CHANGE")}
            // onHover={console.log("UPDATE HOVER")}
        />
      </div>
      

      <div className={styles.checkboxHeading}>ADDITIONAL</div>
        <Checkbox
          checkboxData={fields.filter(field => field.default === false)}
          // changeHandler={console.log("UPDATE CHANGE")}
          // onHover={console.log("UPDATE HOVER")}
        />
    </div>
  </section>
);

export default DtgTableColumnSelector;