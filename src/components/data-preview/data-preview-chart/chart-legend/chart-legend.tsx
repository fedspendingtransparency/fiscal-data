import React, { FunctionComponent } from 'react';
import CheckboxLabel from '../../../checkbox/checkbox-label/checkbox-label';
import { buttonContainer, legendButtons, sectionContainer } from './chart-legend.module.scss';

export interface IField {
  active: boolean;
  field: string;
  label: string;
}

export interface IChartLegend {
  fields: IField[];
  onLabelChange: (fields: IField[]) => void;
  onHover: (boolean, field: IField) => void;
  legendVisibility?: boolean;
}

const ChartLegend: FunctionComponent<IChartLegend> = ({ fields, onLabelChange, onHover }) => {
  const handleClick = (e, isKeyPress, checkedValue) => {
    if (isKeyPress) {
      fields[e.target.value].active = checkedValue;
    } else {
      fields[e.target.value].active = e.target.checked;
    }
    onLabelChange(fields.filter(obj => obj.active));
  };

  return (
    <section className={legendButtons}>
      <div className={sectionContainer}>
        {fields.map((field, index) => (
          <div className={buttonContainer} key={index}>
            <CheckboxLabel obj={field} handleClick={handleClick} onHover={onHover} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChartLegend;
