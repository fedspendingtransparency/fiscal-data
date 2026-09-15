import React from 'react';
import ReactMarkdown from 'react-markdown';
import CustomLink from '../links/custom-link/custom-link';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

const rehypePlugins = [rehypeRaw, [rehypeSanitize, defaultSchema]];

export const MarkdownTransform: FunctionComponent = ({ content, customClass }) => {
  return (
    <ReactMarkdown
      children={content}
      className={customClass ? customClass : ''}
      components={{
        a: ({ children, href }) => {
          return <CustomLink url={href}>{children}</CustomLink>;
        },
      }}
      rehypePlugins={rehypePlugins}
    />
  );
};
