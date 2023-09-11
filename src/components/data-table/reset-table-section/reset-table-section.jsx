import React from 'react';
import { sectionBorder, resetButton, arrowIcon, activeButton } from './reset-table-section.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';

const ResetTableSection = ({ resetColumns, active }) => {
  return (
    <div className={sectionBorder}>
      <button className={classnames([resetButton, active ? activeButton : null])} onClick={() => resetColumns()} aria-label="Reset Filters">
        <>
          <FontAwesomeIcon icon={faArrowRotateRight} className={arrowIcon} />
          Reset Filters
        </>
      </button>
    </div>
  );
};

export default ResetTableSection;
