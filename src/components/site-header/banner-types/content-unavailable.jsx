import React from 'react';
import AnnouncementBanner from '../../announcement-banner/announcement-banner';
import CustomLink from '../../links/custom-link/custom-link';
import { bannerHeading, bannerContent} from './../site-header.module.scss';

const ContentUnavailable = () => {

return (
      <AnnouncementBanner closable={false}>
        <div className={bannerHeading}> Content Temporarily Unavailable:</div>
        <div className={bannerContent}>
          The Fiscal Data team is working to address the current issue with this page. Please check back later or contact us via email at{' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">fiscaldata@fiscal.treasury.gov</CustomLink> for further assistance. Thank you.
        </div>
      </AnnouncementBanner>
  );
};
export default ContentUnavailable;