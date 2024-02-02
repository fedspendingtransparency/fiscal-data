import React, { FunctionComponent } from 'react';
import { legendContainer, checkbox, labelText, labelCheckmarkContainer, checkmarkText, select } from './chart-legend.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface IChartLegend {
  lines: string[];
  [lineMap: string]: { color: string; label: string };
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
  };
  return (
    <div className={legendContainer}>
      {lines.map(line => {
        return (
          <label className={checkbox}>
            {' '}
            <input
              name={lineMap[line].label}
              id={lineMap[line].label}
              onChange={() => handleChange(line)}
              value={!lineMap[line].hidden}
              type="checkbox"
              checked={!lineMap[line].hidden}
              style={{ background: lineMap[line].color }}
              hidden={true}
              className={select}
            />
            <span className={labelCheckmarkContainer}>
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
