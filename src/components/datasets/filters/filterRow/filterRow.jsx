import React, { useEffect, useState } from 'react';
import { checkbox_wrapper, labelCheckmarkContainer, labelCheckmarkText, row } from './filterRow.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import FilterCount from './filterCount/filterCount';
import Analytics from '../../../../utils/analytics/analytics';

const FilterRow = ({ onChange, filterKey, filterTally, children, currentState, title, analyticsObject }) => {
  const [checked, setChecked] = useState(currentState || false);

  const handleClick = () => {
    const newVal = !currentState;
    setChecked(newVal);
    onChange({
      key: filterKey,
      value: newVal,
    });

    if (newVal) {
      Analytics.event({
        category: analyticsObject.category,
        action: analyticsObject.action,
        label: children,
      });

      // GA4 event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: analyticsObject.event,
        eventLabel: children,
      });
    }
  };

  useEffect(() => {
    setChecked(currentState || false);
  }, [currentState]);

  useEffect(() => {
    onChange({
      key: filterKey,
      value: currentState || false,
    });
  }, []);

  return (
    <div className={row} data-testid="filterRow">
      <label>
        <div className={checkbox_wrapper}>
          <input type="checkbox" title={title} checked={checked} onChange={handleClick} />
          <span className={labelCheckmarkContainer}>
            <span className={labelCheckmarkText}>
              <FontAwesomeIcon icon={faCheck} size="sm" />
            </span>
          </span>
        </div>
        {children}
      </label>
      <FilterCount count={filterTally} />
    </div>
  );
};

export default FilterRow;
