import React, { FunctionComponent } from 'react';
import SelectAll from '../../../select-all/selectAll';
import Checkbox from '../../../checkbox/checkbox';
import { buttonContainer, heading, selectAllContainer } from './chart-legend-panel.module.scss';
import { IChartLegend } from '../chart-legend/chart-legend';

const ChartLegendPanel: FunctionComponent<IChartLegend> = ({ fields, onLabelChange, onHover, legendVisibility }) => {
  return (
    <section>
      {legendVisibility && (
        <>
          <h1 className={heading}>Legend ({fields.length})</h1>
          <div className={selectAllContainer}>
            <SelectAll fields={fields} isVisible={true} onUpdateFields={onLabelChange} />
          </div>
          <div className={buttonContainer}>
            <Checkbox checkboxData={fields} changeHandler={onLabelChange} onHover={onHover} />
          </div>
        </>
      )}
    </section>
  );
};

export default ChartLegendPanel;
