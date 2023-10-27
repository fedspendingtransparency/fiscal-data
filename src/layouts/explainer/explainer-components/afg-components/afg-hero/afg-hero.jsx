import React, { useEffect, useState, useRef } from 'react';
import { 
  heroSkyImage, 
  heroContainer, 
  textContainer, 
  heroMainText, 
  heroLibertyImage,
  heroSubText,
  heroAFG ,
  heroHeadText,
  heroIcon
  } from './afg-hero.module.scss';

export default function AfgHero() {

  const afgIcon = '/images/AFG-icon-overview.svg';

  return (
    <div className={heroContainer} data-testid="afg-hero">
      <div className={heroSkyImage} aria-label="Blue Sky." >
          <div className={heroLibertyImage} aria-label="Statue of Liberty." />
        <div className={textContainer}>
          <span className={heroAFG}>
            <img src={afgIcon} alt="An open book with a coin above the pages." className={heroIcon} />
            <div className={heroHeadText}>YOUR GUIDE TO AMERICA'S FINANCES</div>
          </span>
          <div className={heroMainText}>
            The Latest Data on Federal Revenue, Spending, Deficit, and the National Debt
          </div>
          <div className={heroSubText}>Understand the Basics of Federal Finances from the U.S. Treasury Department</div>
        </div>
      </div>
    </div>
  );
}
