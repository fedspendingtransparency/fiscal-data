import React from 'react';
import CustomLink from '../../links/custom-link/custom-link';
import { bannerHeading, bannerContent} from './../site-header.module.scss';

const DatasetUnavailable = ({ datasetPageName }) => {


return (
      <>
        <div className={bannerHeading}> Dataset Unavailable:</div>
        <div className={bannerContent}>
          Fiscal Data is currently experiencing an issue with the {datasetPageName}. 
          Our Fiscal Service team is working to address the issue. Please check back later or contact us via email at {' '}
          <CustomLink url="mailto:fiscaldata@fiscal.treasury.gov">fiscaldata@fiscal.treasury.gov</CustomLink> for further assistance. Thank you.
        </div>
      </>
  );
};
export default DatasetUnavailable;