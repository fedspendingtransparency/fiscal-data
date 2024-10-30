import React from 'react';

interface iHeading {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className;
  children;
}

const Heading = ({ headingLevel, className, children }: iHeading) => {
  const H = headingLevel;
  return <H className={className}>{children}</H>;
};

export default Heading;
