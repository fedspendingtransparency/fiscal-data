import React, { FunctionComponent } from 'react';
import Checkbox from '../../../checkbox/checkbox';
import { buttonContainer } from '../chart-legend-panel/chart-legend-panel.module.scss';

const ChartLegend: FunctionComponent = ({ fields, onLabelChange, onHover }) => {
  return (
    <section>
      <div className={buttonContainer}>
        <Checkbox checkboxData={fields} changeHandler={onLabelChange} onHover={onHover} />
      </div>
    </section>
  );
};

export default ChartLegend;
