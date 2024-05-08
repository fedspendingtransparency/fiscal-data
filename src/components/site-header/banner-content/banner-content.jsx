import React from 'react';
import CustomLink from '../../links/custom-link/custom-link';
import { bannerContent } from './../site-header.module.scss';
import reactStringReplace from 'react-string-replace';
import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const BannerContent = ({ content }) => {
  const replaceLinkTextWithLink = string => {
    const regex = /(https?:\/\/[^\s]+)/g;
    return reactStringReplace(string, regex, (match, i) => {
      return reactElementToJSXString(<a href={match}>{match}</a>);
    });
  };

  return (
    <>
      <div className={bannerContent} data-testid={'announcement-banner'}>
        <ReactMarkdown
          children={replaceLinkTextWithLink(content)
            .toString()
            .replaceAll(/,/g, '')}
          components={{
            a: ({ children, href }) => {
              return <CustomLink url={href}>{children}</CustomLink>;
            },
          }}
          rehypePlugins={[rehypeRaw]}
        />
      </div>
    </>
  );
};
export default BannerContent;
