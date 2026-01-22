import React, { FunctionComponent } from 'react';
import { infoContainer } from './datatable-banner.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { info, icon } from '../../dataset-data/dataset-chart/dataset-chart.module.scss';

type DatatableBannerProps = {
  bannerNotice: string;
};

const infoCirclePropIcon = faInfoCircle as IconProp;
const DatatableBanner: FunctionComponent<DatatableBannerProps> = ({ bannerNotice }) => {
  return (
    <div className={infoContainer}>
      <div className={info} data-testid="datatable-banner">
        <FontAwesomeIcon className={icon} icon={infoCirclePropIcon} />
        {bannerNotice}
      </div>
    </div>
  );
};

export default DatatableBanner;
