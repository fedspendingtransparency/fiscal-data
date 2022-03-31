import React, { FunctionComponent } from 'react';
import { IHeroImage } from '../../../models/IHeroImage';

import {
  mainContainer,
  heroImageHeading,
  heroImageSubHeading,
} from './hero-image.module.scss';

const HeroImage: FunctionComponent<IHeroImage> = ({
  heading,
  subHeading,
  primaryColor,
  children
}) => {
  return (
    <div
      className={mainContainer}
      style={{ backgroundColor: primaryColor }}
      data-testid="main-container"
    >
      <h1 className={heroImageHeading}>{heading}</h1>
      {children}
      <p className={heroImageSubHeading}>{subHeading}</p>
    </div>
  )
}

export default HeroImage;
