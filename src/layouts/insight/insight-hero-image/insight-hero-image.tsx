import React from 'react';
import { sectionHeading } from '../insight.module.scss';

export const InsightHeroImage: ({ heading, children }: { heading: string; children: any }) => React.JSX.Element = ({ heading, children }) => {
  return (
    <>
      {heading !== '' && <h1 className={sectionHeading}>{heading}</h1>}
      {children}
    </>
  );
};
