import React, { FunctionComponent } from 'react';
import { infoContainer, note } from './data-preview-datatable-banner.module.scss';

type DatatableBannerProps = {
  bannerNotice: string;
};

const DataPreviewDatatableBanner: FunctionComponent<DatatableBannerProps> = ({ bannerNotice }) => {
  return (
    <div className={infoContainer}>
      <span className={note}>Note:</span>
      <span data-testid="datatable-banner">{' ' + bannerNotice}</span>
    </div>
  );
};

export default DataPreviewDatatableBanner;
