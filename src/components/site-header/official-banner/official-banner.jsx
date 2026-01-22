import React, { useState } from 'react';
import {
  container,
  officialBanner,
  text,
  flag,
  bannerContent,
  lockIcon,
  usaAccordion,
  usaAccordionContent,
  usaAccordionContainer,
  usaBannerGuidance,
  usaBannerIconContainer,
  usaBannerIcon,
  chevronIcon,
  usaAccordionToggle,
} from './official-banner.module.scss';
import ExperimentalSwitch from '../../experimental/experimental-switch/experimental-switch';
import { StaticImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

const OfficialBanner = () => {
  const [bannerToggle, setBannerToggle] = useState(false);
  const officialBannerText = 'An official website of the U.S. government';
  const bannerDropdownText = "Here's how you know";

  return (
    <div className={container}>
      <div className={officialBanner} data-testid="officialBanner">
        <div className={bannerContent}>
          <div className={flag} data-testid="bannerImage">
            <StaticImage src="../../../images/us_flag_small.png" title="small flag" alt="Small U.S. flag" placeholder="blurred" data-testid="flag" />
          </div>
          <div className={text} data-testid="bannerText">
            {officialBannerText}
            <button onClick={() => setBannerToggle(!bannerToggle)} className={usaAccordionToggle}>
              {bannerDropdownText}
              <FontAwesomeIcon icon={bannerToggle ? faChevronUp : faChevronDown} className={chevronIcon} />
            </button>
          </div>
        </div>
        <div className="empty">
          <ExperimentalSwitch />
        </div>
      </div>
      {bannerToggle && (
        <div className={usaAccordion}>
          <div className={usaAccordionContainer}>
            <div className={usaAccordionContent}>
              <div className={usaBannerIconContainer}>
                <StaticImage
                  src="../../../images/official-banner-icons/icon-dot-gov.svg"
                  title=""
                  alt="Dot gov"
                  placeholder="blurred"
                  data-testid="dot-gov"
                  className={usaBannerIcon}
                />
              </div>
              <p className={usaBannerGuidance}>
                <strong>Official websites use .gov</strong> <br />A <strong>.gov</strong> website belongs to an official government organization in
                the United States.
              </p>
            </div>
            <div className={usaAccordionContent}>
              <div className={usaBannerIconContainer}>
                <StaticImage
                  src="../../../images/official-banner-icons/icon-https.svg"
                  alt="Https"
                  placeholder="blurred"
                  data-testid="https"
                  className={usaBannerIcon}
                />
              </div>
              <p className={usaBannerGuidance}>
                <strong>Secure .gov websites use HTTPS</strong> <br />
                <span>
                  A <strong>lock</strong>(<FontAwesomeIcon icon={faLock} className={lockIcon} />) or <strong>https://</strong> means you’ve safely
                  connected to the .gov website. Share sensitive information only on official, secure websites.
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialBanner;
