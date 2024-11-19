import React from 'react';
import { ReactElement } from 'react';
import { sectionHeading } from '../insight.module.scss';

export const InsightHeroImage = ({ heading }: string, subHeading: string, children: ReactElement): ReactElement => {
  console.log(heading);
  return (
    <>
      {heading !== '' && <h1 className={sectionHeading}>{heading}</h1>}
      {children}
    </>
  );
};
