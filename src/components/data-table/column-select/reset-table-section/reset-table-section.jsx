import React from 'react';
import {
  sectionBorder,
  resetButton,
  arrowIcon,
} from './reset-table-section.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';


const ResetTableSection = ({resetColumns}) => {

  return (
    <div className={sectionBorder}>
      <button
        className={resetButton}
        onClick={() => resetColumns()}
        data-testid="reset-button"
      >
        <>
          <FontAwesomeIcon icon={faArrowRotateRight} className={arrowIcon}/>
          Reset Filters
        </>
      </button>
    </div>
  )
}

export default ResetTableSection;
