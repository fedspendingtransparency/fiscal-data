import React, { FunctionComponent } from 'react';
import CheckboxLabel from '../../../checkbox/checkbox-label/checkbox-label';
import { buttonContainer, centerFields, field as fieldStyle, legendButtons, sectionContainer } from './chart-legend.module.scss';
import { legendColors } from '../chart-helper';

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

  const flexWidth = arr => {
    const length = arr.length;
    let width = 21;
    if (length < 4) {
      width = Math.floor(100 / length);
    } else if (length % 3 === 0) {
      width = 33;
    }
    return width;
  };

  return (
    <section className={legendButtons}>
      <div className={sectionContainer}>
        {fields.map((field, index) => (
          <div
            className={`${fieldStyle} ${fields.length < 4 ? centerFields : undefined}`}
            style={{ width: `${flexWidth(fields)}%` }}
            data-testid="legendField"
            key={index}
          >
            <div className={buttonContainer}>
              <CheckboxLabel obj={field} handleClick={handleClick} onHover={onHover} index={index} boxColor={legendColors[index]} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChartLegend;
