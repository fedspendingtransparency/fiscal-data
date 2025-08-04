import { ReactNode } from 'react';

export interface IHeroImage {
  heading: string;
  subHeading: string;
  primaryColor: string;
  secondaryColor: string;
  width?: number;
  pageName?: string;
  children: ReactNode;
}
