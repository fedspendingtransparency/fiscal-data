import React from 'react';
import { sectionBorder, resetButton, arrowIcon, activeButton, resetButtonContainer, bannerContainer } from './reset-table-section.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons/faArrowRotateRight';
import classnames from 'classnames';
import BannerCallout from '../../banner-callout/banner-callout';

const ResetTableSection = ({ resetColumns, active, textFilteringDisabled }) => {
  const filteringBanner = { banner: 'TextFilterDisabled' };
  const reset = () => {
    if (active) {
      resetColumns();
    }
  };
  return (
    <div className={sectionBorder}>
      <div className={bannerContainer}>{textFilteringDisabled && <BannerCallout bannerCallout={filteringBanner} bannerType="warning" />}</div>
      <div className={resetButtonContainer}>
        <button className={classnames([resetButton, active ? activeButton : null])} onClick={reset} aria-label="Reset Filters">
          <FontAwesomeIcon icon={faArrowRotateRight} className={arrowIcon} />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ResetTableSection;
