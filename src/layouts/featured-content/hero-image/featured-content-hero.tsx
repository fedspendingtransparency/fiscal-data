import React, { FunctionComponent } from 'react';
import { useWindowSize } from 'usehooks-ts';
import {
  featuredContentHeroPrimary,
  featuredContentHeroSecondary,
  heroBorder,
  heroContainer,
  heroHeading,
} from './featured-content-hero.module.scss';

interface IFeaturedContentHero {
  heading: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const FeaturedContentHero: FunctionComponent<IFeaturedContentHero> = ({
  heading,
  primaryColor = featuredContentHeroPrimary,
  secondaryColor = featuredContentHeroSecondary,
}) => {
  const { width: windowWidth } = useWindowSize({ initializeWithValue: false });
  const width = windowWidth || 1920;

  const lineHeight = 8;
  const chevronHeight = 18;
  const chevronSpacing = 34;
  const chevronPointHeight = chevronHeight + 9.24;

  const p1 = `L${width / 2 - chevronSpacing} 0 `;
  const p2 = `L${width / 2} ${chevronHeight} `;
  const p3 = `L${width / 2 + chevronSpacing} 0 `;
  const p4 = `L${width} 0 `;
  const p5 = `L${width} ${lineHeight} `;
  const p6 = `L${width / 2 + chevronSpacing + 4} ${lineHeight} `;
  const p7 = `L${width / 2} ${chevronPointHeight} `;
  const p8 = `L${width / 2 - chevronSpacing - 4} ${lineHeight} `;
  const p9 = `L0 ${lineHeight}`;

  return (
    <>
      <div className={heroContainer} data-testid="featured-content-hero">
        <h1 className={heroHeading} style={{ color: primaryColor }}>
          {heading}
        </h1>
      </div>
      <div className={heroBorder} data-testid="hero-border">
        {!!width && (
          <svg height="28" width="100%" preserveAspectRatio="xMidYMid slice" viewBox={`0 0 ${width} 28`}>
            <defs>
              <linearGradient id="featuredContentGradient" cx="50%" cy="50%" r="50%">
                <stop offset="38%" stopColor={primaryColor} />
                <stop offset="50%" stopColor={secondaryColor} />
                <stop offset="62%" stopColor={primaryColor} />
              </linearGradient>
            </defs>
            <path d={'M0 0 ' + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + ' Z'} fill="url(#featuredContentGradient)" />
          </svg>
        )}
      </div>
    </>
  );
};

export default FeaturedContentHero;
