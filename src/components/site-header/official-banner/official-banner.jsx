import React, { useState } from 'react';
import { container, officialBanner, text, flag, dropdownButton, dropdownContainer, dropdownContent } from './official-banner.module.scss';
import ExperimentalSwitch from '../../experimental/experimental-switch/experimental-switch';
import { StaticImage } from 'gatsby-plugin-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faLock } from '@fortawesome/free-solid-svg-icons';

const OfficialBanner = () => {
  const [bannerToggle, setBannerToggle] = useState(false);
  const officialBannerText = 'An official website of the U.S. government';
  const bannerDropdownText = "Here's how you know";
  return (
    <div className={container}>
      <div className={officialBanner} data-testid="officialBanner">
        <div className="empty">
          <ExperimentalSwitch />
        </div>
        <div className={text} data-testid="bannerText">
          <div className={flag} data-testid="bannerImage">
            <StaticImage src="../../../images/us_flag_small.png" title="small flag" alt="Small U.S. flag" placeholder="blurred" data-testid="flag" />
          </div>
          {officialBannerText}
          <button onClick={() => setBannerToggle(!bannerToggle)} className={dropdownButton}>
            {bannerDropdownText}
            <FontAwesomeIcon icon={bannerToggle ? faChevronUp : faChevronDown} />
          </button>
        </div>
      </div>
      {bannerToggle && (
        <div className={dropdownContainer}>
          <div className={dropdownContent}>
            <StaticImage src="../../../images/official-banner-icons/icon-dot-gov.svg" title="" alt="" placeholder="blurred" data-testid="dot-gov" />
            <span>
              <b>Official websites use .gov</b> A <b>.gov</b> website belongs to an official government organization in the United States.
            </span>
          </div>
          <div className={dropdownContent}>
            <StaticImage src="../../../images/official-banner-icons/icon-https.svg" title="" alt="" placeholder="blurred" data-testid="https" />
            <span>
              <b>Secure .gov websites use HTTPS</b> A <b>lock</b>(<FontAwesomeIcon icon={faLock} />) or <b>https://</b> means you’ve safely connected
              to the .gov website. Share sensitive information only on official, secure websites.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficialBanner;
