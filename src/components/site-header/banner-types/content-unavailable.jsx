import React from 'react';
import CustomLink from '../../links/custom-link/custom-link';
import { bannerHeading, bannerContent} from './../site-header.module.scss';

const ContentUnavailable = ({content}) => {

return (
      <>
        {/*<div className={bannerHeading}> Content Temporarily Unavailable:</div>*/}
        <div className={bannerContent}>
          {content}
        </div>
      </>
  );
};
export default ContentUnavailable;
