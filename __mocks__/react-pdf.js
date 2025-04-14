import React from 'react';

export const Text = ({ style, children }) => {
  return <div style={style}>{children}</div>;
};

export const View = ({ style, children }) => {
  return <div style={style}>{children}</div>;
};
export const Page = ({ style, children }) => {
  return <div style={style}>{children}</div>;
};
export const Document = ({ style, children }) => {
  return <div style={style}>{children}</div>;
};

export const pdf = () => {
  const blob = { size: 4000 };
  return {
    toBlob: () => blob,
  };
};

export const PDFDownloadLink = ({ children, fileName }) => {
  return (
    <a download={fileName} href="test/href">
      {children}
    </a>
  );
};

export default PDFDownloadLink;
