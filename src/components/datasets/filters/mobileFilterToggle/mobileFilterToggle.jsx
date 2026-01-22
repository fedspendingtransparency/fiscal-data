import React from 'react';
import { container, filterCount, floatingToggle, resetButton, resetIcon, srOnly, toggleButton } from './mobileFilterToggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo } from '@fortawesome/free-solid-svg-icons';

export default function MobileFilterToggle({ filterCnt, datasetsView, toggleDatasetView, datasetsCount, filterReset }) {
  const showFilterButton = !datasetsView && filterCnt > 0;
  return (
    <section className={floatingToggle} data-testid="mobile-filter-toggle">
      <div className={container}>
        {showFilterButton && (
          <button className={resetButton} onClick={filterReset}>
            <span className={filterCount}>
              <span className={srOnly}>Reset </span>
              {filterCnt}
              <span className={srOnly}> Selected Filter{filterCnt === 1 ? '' : 's'}</span>
            </span>{' '}
            <FontAwesomeIcon className={resetIcon} icon={faUndo} size={'1x'} />
          </button>
        )}
        <button className={toggleButton} onClick={toggleDatasetView}>
          {datasetsView ? 'Filter Your Results' : `View Your Results (${datasetsCount})`}
        </button>
      </div>
    </section>
  );
}
