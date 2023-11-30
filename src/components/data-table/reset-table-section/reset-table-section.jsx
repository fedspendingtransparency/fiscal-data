import React from 'react';
import { sectionBorder, resetButton, arrowIcon, activeButton } from './reset-table-section.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import classnames from 'classnames';
import BannerCallout from '../../banner-callout/banner-callout';

const ResetTableSection = ({ resetColumns, active, textFilteringDisabled }) => {
  const filteringBanner = { banner: 'TextFilterDisabled' };
  return (
    <div className={sectionBorder}>
      {!textFilteringDisabled && <BannerCallout bannerCallout={filteringBanner} bannerType="warning" displayIcon={false} />}
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
