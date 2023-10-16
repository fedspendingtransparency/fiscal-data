import React from 'react';

const Layout = ({ children }) => {
  return <div className={['mdx-layout', 'default'].join(' ')}>{children}</div>;
};

export default Layout;
