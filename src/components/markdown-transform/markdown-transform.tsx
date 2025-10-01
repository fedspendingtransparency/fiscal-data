import React, { FunctionComponent } from 'react';
import reactStringReplace from 'react-string-replace';
import reactElementToJSXString from 'react-element-to-jsx-string';
import ReactMarkdown from 'react-markdown';
import CustomLink from '../links/custom-link/custom-link';
import rehypeRaw from 'rehype-raw';

const replaceLinkTextWithLink = string => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const stringArray = reactStringReplace(string, regex, (match, i) => {
    return reactElementToJSXString(<a href={match}>{match}</a>);
  });
  let stringOutput = '';
  stringArray.forEach(str => (stringOutput = stringOutput + str));
  return stringOutput;
};

export const MarkdownTransform: FunctionComponent = ({ content, isBanner, customClass }) => {
  return (
    <>
      {isBanner ? (
        <ReactMarkdown
          children={replaceLinkTextWithLink(content)}
          components={{
            a: ({ children, href }) => {
              return <CustomLink url={href}>{children}</CustomLink>;
            },
          }}
          rehypePlugins={[rehypeRaw]}
        />
      ) : (
        <ReactMarkdown
          children={content}
          className={customClass ? customClass : ''}
          components={{
            a: ({ children, href }) => {
              return <CustomLink url={href}>{children}</CustomLink>;
            },
          }}
          rehypePlugins={[rehypeRaw]}
        />
      )}
    </>
  );
};
