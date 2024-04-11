import React from 'react';
import CustomLink from '../../links/custom-link/custom-link';
import {bannerContent} from './../site-header.module.scss';
import reactStringReplace from "react-string-replace";

const BannerContent = ({content}) => {

const replaceLinkTextWithLink = () => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return reactStringReplace(content, regex, (match, i) => {
    return <CustomLink url={match}>{match}</CustomLink>;
  });
}



return (
      <>
        <div className={bannerContent} data-testid={'announcement-banner'}>
          {replaceLinkTextWithLink()}
        </div>
      </>
  );
};
export default BannerContent;
