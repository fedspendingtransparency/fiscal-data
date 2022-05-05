import React, { FunctionComponent } from 'react';
import { IHeroImage } from '../../../models/IHeroImage';

import {
  mainContainer,
  heroImageHeading,
  heroImageSubHeading,
  bottomBorder
} from './hero-image.module.scss';
import {withWindowSize} from "react-fns";

const HeroImage: FunctionComponent<IHeroImage> = ({
  heading,
  subHeading,
  primaryColor,
  secondaryColor,
  width,
  children
}) => {
  const spacing = 34;
  const h = 8;
  const pointHeight = 18;

  const p0 = "M0 0"
  const p1 = `L${width/2 - spacing} 0`;
  const p2 = `L${width/2} ${pointHeight}`;
  const p3 = `L${width/2 + spacing} 0`;
  const p4 = `L${width} 0`;
  const p5 = `L${width} ${h}`;
  const p6 = `L${width/2 + spacing + 4} ${h}`;
  const p7 = `L${width/2} ${pointHeight + 9.24}`;
  const p8 = `L${width/2 - spacing - 4 } ${h}`;
  const p9 = `L0 ${h}`;

  const shape= p0 +" "+ p1 +" "+ p2 +" "+ p3 +" "+ p4 +" "+ p5 +" "+ p6 +" "+ p7 +" "+ p8 +" "+ p9 + " Z";
  console.log(width);
  return (
    <>
      <div
        className={mainContainer}
        data-testid="main-container"
      >
        <h1
          className={heroImageHeading}
          style={{ color: primaryColor }}
        >
          {heading}
        </h1>
        {children}
        <p className={heroImageSubHeading}>{subHeading}</p>
      </div>
      <div className={bottomBorder}>
        <svg height={28} width={width}>
          <defs>
            <linearGradient id="Gradient">
              <stop offset="38%" stopColor={primaryColor}/>
              <stop offset="50%" stopColor={secondaryColor}/>
              <stop offset="62%" stopColor={primaryColor}/>
            </linearGradient>
          </defs>
          <path d={shape}
                fill="url(#Gradient)"
          />
        </svg>
      </div>
    </>
  )
}

export default withWindowSize(HeroImage);
