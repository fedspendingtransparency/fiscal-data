import React, { FunctionComponent } from 'react';
import { infoContainer, note, infoContainerReport } from './data-preview-datatable-banner.module.scss';

type DatatableBannerProps = {
  bannerNotice: string;
};

const DataPreviewDatatableBanner: FunctionComponent<DatatableBannerProps> = ({ bannerNotice, isReport = false }) => {
  return (
    <div className={isReport ? infoContainerReport : infoContainer}>
      <span className={note}>Note:</span>
      <span data-testid="datatable-banner">{' ' + bannerNotice}</span>
    </div>
  );
};

export default DataPreviewDatatableBanner;
