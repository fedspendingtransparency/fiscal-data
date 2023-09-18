import React, { FunctionComponent, useEffect, useState } from 'react';
import { IHeroImage } from '../../../models/IHeroImage';

import { mainContainer, heroImageHeading, heroImageSubHeading, heroBorder } from './hero-image.module.scss';
import { withWindowSize } from 'react-fns';
import { getShortForm } from '../../../utils/rounding-utils';
import { useRecoilValueLoadable } from 'recoil';
import { debtToThePennyData } from '../../../recoil/debtToThePennyDataState';

const HeroImage: FunctionComponent<IHeroImage> = ({ heading, subHeading, primaryColor, secondaryColor, width, children, pageName }) => {
  const [debtAmount, setDebtAmount] = useState('');
  const data = useRecoilValueLoadable(debtToThePennyData);

  useEffect(() => {
    if (data.state === 'hasValue') {
      setDebtAmount(data.contents[0]?.tot_pub_debt_out_amt);
    }
  }, [data.state]);

  const getSubHeading = subHeading => {
    if (pageName === 'national-debt') {
      const match = 'national debt';
      if (debtAmount) {
        return subHeading?.replace(match, `${match} ($${getShortForm(debtAmount)})`);
      }
      return subHeading;
    } else {
      return subHeading;
    }
  };
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
      <div className={mainContainer} data-testid="main-container">
        <h1 className={heroImageHeading} style={{ color: primaryColor }}>
          {heading}
        </h1>
        {subHeading && <p className={heroImageSubHeading}>{getSubHeading(subHeading)}</p>}
        {children}
      </div>
      <div className={heroBorder} data-testid="hero-border">
        <svg height="28" width="100%" preserveAspectRatio="xMidYMid slice" viewBox={`0 0 ${width} 28`}>
          <defs>
            <linearGradient id="Gradient">
              <stop offset="38%" stopColor={primaryColor} />
              <stop offset="50%" stopColor={secondaryColor} />
              <stop offset="62%" stopColor={primaryColor} />
            </linearGradient>
          </defs>
          <path d={'M0 0 ' + p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9 + ' Z'} fill="url(#Gradient)" />
        </svg>
      </div>
    </>
  );
};

export default withWindowSize(HeroImage);
