import React from 'react';
import { FunctionComponent } from 'react';
import reactStringReplace from 'react-string-replace';
import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactMarkdown from 'react-markdown';
import CustomLink from '../links/custom-link/custom-link';
import rehypeRaw from 'rehype-raw';

const replaceLinkTextWithLink = string => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return reactStringReplace(string, regex, (match, i) => {
    return reactElementToJSXString(<a href={match}>{match}</a>);
  });
};

export const MarkdownTransform: FunctionComponent = ({ content }) => {
  return (
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
  );
};
