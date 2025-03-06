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

const PDFGenerator = ({ children }) => {
  return <>{children}</>;
};

export default PDFGenerator;
