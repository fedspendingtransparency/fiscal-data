import React, { FunctionComponent } from 'react';

interface IHeading {
  headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  children: string;
}

const Heading: FunctionComponent<IHeading> = ({ headingLevel, className, children }: IHeading) => {
  const HeadingTag = headingLevel;
  return <HeadingTag className={className}>{children}</HeadingTag>;
};

export default Heading;
