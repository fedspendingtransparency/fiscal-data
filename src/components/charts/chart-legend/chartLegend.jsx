import React from 'react';
import * as styles from './chartLegend.module.scss';
import Checkbox from '../../checkbox/checkbox';
import SelectAll from '../../select-all/selectAll';

const ChartLegend = ({ fields, isVisible, onLabelChange, onHover }) => (
  <section>
    <h1 className={styles.heading}>Legend ({fields.length})</h1>
    <div className={styles.selectAllContainer}>
      <SelectAll
        fields={fields}
        isVisible={isVisible}
        onUpdateFields={onLabelChange}
      />
    </div>
    <div className={styles.buttonContainer}>
      <Checkbox
        checkboxData={fields}
        changeHandler={onLabelChange}
        onHover={onHover}
      />
    </div>
  </section>
);

export default ChartLegend;
