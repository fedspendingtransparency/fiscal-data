import React, { FunctionComponent } from 'react';
import ReactMarkdown from 'react-markdown';
import { ErrorBoundary } from 'react-error-boundary';
import CustomLink from '../links/custom-link/custom-link';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

interface IMarkdownTransform {
  content: string;
  customClass?: string;
}

const rehypePlugins = [rehypeRaw, [rehypeSanitize, defaultSchema]];

export const MarkdownTransform: FunctionComponent<IMarkdownTransform> = ({ content, customClass }) => {
  return (
    <ErrorBoundary fallback={<></>}>
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
    </ErrorBoundary>
  );
};
