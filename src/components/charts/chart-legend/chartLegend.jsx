import React from 'react';
import { heading, selectAllContainer, buttonContainer } from './chartLegend.module.scss';
import Checkbox from '../../checkbox/checkbox';
import SelectAll from '../../select-all/selectAll';

const ChartLegend = ({ fields, isVisible, onLabelChange, onHover }) => (
  <section>
    <h1 className={heading}>Legend ({fields.length})</h1>
    <div className={selectAllContainer}>
      <SelectAll fields={fields} isVisible={isVisible} onUpdateFields={onLabelChange} />
    </div>
    <div className={buttonContainer}>
      <Checkbox checkboxData={fields} changeHandler={onLabelChange} onHover={onHover} />
    </div>
  </section>
);

export default ChartLegend;
