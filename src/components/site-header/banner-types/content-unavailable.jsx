import React from 'react';
import CustomLink from '../../links/custom-link/custom-link';
import { bannerHeading, bannerContent} from './../site-header.module.scss';
import reactStringReplace from "react-string-replace";

const ContentUnavailable = ({content}) => {

const replaceLinkTextWithLink = () => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return reactStringReplace(content, regex, (match, i) => {
    return <CustomLink url={match}>{match}</CustomLink>;
  });
}



return (
      <>
        {/*<div className={bannerHeading}> Content Temporarily Unavailable:</div>*/}
        <div className={bannerContent}>
          {replaceLinkTextWithLink()}
        </div>
      </>
  );
};
export default ContentUnavailable;
