import React, { FunctionComponent } from 'react';
import CheckboxLabel from '../../../checkbox/checkbox-label/checkbox-label';
import { buttonContainer, sectionContainer } from './chart-legend.module.scss';

const ChartLegend: FunctionComponent = ({ fields, onLabelChange, onHover }) => {
  const handleClick = (e, isKeyPress, checkedValue) => {
    if (isKeyPress) {
      fields[e.target.value].active = checkedValue;
    } else {
      fields[e.target.value].active = e.target.checked;
    }
    onLabelChange(fields.filter(obj => obj.active));
  };

  return (
    <section className={sectionContainer}>
      {fields.map((field, index) => (
        <div className={buttonContainer}>
          <CheckboxLabel obj={field} handleClick={handleClick} onHover={onHover} index={index} />
        </div>
      ))}
    </section>
  );
};

export default ChartLegend;
