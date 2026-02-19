import React, { FunctionComponent } from 'react';
import {
  checkbox,
  checkmarkText,
  labelCheckmarkContainer,
  labelText,
  legendContainer,
  select,
} from './chart-legend.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { analyticsEventHandler } from '../../../../../explainer-helpers/explainer-helpers';

interface IChartLineConfig {
  [key: string]: {
    color: string;
    label: string;
    hidden: boolean;
  };
}
interface IChartLegend {
  lineMap: IChartLineConfig;
  lines: string[];
  setHiddenFields: (val: string[]) => void;
  hiddenFields: string[];
}

const ChartLegend: FunctionComponent<IChartLegend> = ({ lines, lineMap, setHiddenFields, hiddenFields }) => {
  const handleChange = id => {
    const lineHidden = lineMap[id].hidden;
    lineMap[id].hidden = !lineHidden;
    if (lineMap[id].hidden) {
      setHiddenFields([...hiddenFields, id]);
    } else {
      setHiddenFields([...hiddenFields.filter(val => val !== id)]);
    }
    analyticsEventHandler(`Savings Bonds - ${id} Savings Bonds Type`, 'Chart Filter Click');
  };
  return (
    <div className={legendContainer}>
      {lines.map((line, index) => {
        return (
          <label className={checkbox} key={index}>
            <input
              name={lineMap[line].label}
              id={lineMap[line].label}
              onChange={() => handleChange(line)}
              onKeyDown={e => e.key === 'Enter' && handleChange(line)}
              value={`${!lineMap[line].hidden}`}
              type="checkbox"
              checked={!lineMap[line].hidden}
              hidden={true}
              className={select}
            />
            <span
              className={labelCheckmarkContainer}
              style={{ background: `${lineMap[line].color} -19px top no-repeat`, border: `1px solid ${lineMap[line].color}` }}
            >
              <span className={checkmarkText}>
                <FontAwesomeIcon icon={faCheck as IconProp} size="sm" />
              </span>
            </span>
            <span className={labelText}>{lineMap[line].label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ChartLegend;
