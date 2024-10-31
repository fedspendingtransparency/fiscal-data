import React, { FunctionComponent } from 'react';
import {
  chartLegend,
  label,
  leftLabelText,
  leftLine,
  lengendItem,
  line,
  rightLine,
} from '../../../layouts/explainer/sections/treasury-savings-bonds/purchase-of-savings-bonds/i-bond-sales-chart/i-bond-sales-chart.module.scss';
import classNames from 'classnames';

interface ILegendLabel {
  text: string;
  color?: string;
  type?: string;
  decoration?: string;
}

interface ILineLegend {
  leftLabel: ILegendLabel;
  rightLabel: ILegendLabel;
}

const LineLengend: FunctionComponent<ILineLegend> = ({ leftLabel, rightLabel }: ILineLegend) => {
  return (
    <div className={chartLegend}>
      <div className={lengendItem}>
        <div className={classNames([label, leftLabelText])} style={{ color: leftLabel.color }}>
          {leftLabel.text}
        </div>
        <div className={classNames([line, leftLine])} />
      </div>
      <div className={lengendItem}>
        <div className={classNames([line, rightLine])} />
        <div className={label}>{rightLabel.text}</div>
      </div>
    </div>
  );
};

export default LineLengend;
