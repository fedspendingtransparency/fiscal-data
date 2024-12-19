import React from 'react';
import { bannerContent } from './../site-header.module.scss';
import { MarkdownTransform } from '../../markdown-transform/markdown-transform';

const BannerContent = ({ content }) => {
  return (
    <>
      <div className={bannerContent} data-testid={'announcement-banner'}>
        <MarkdownTransform content={content} />
      </div>
    </>
  );
};
export default BannerContent;
