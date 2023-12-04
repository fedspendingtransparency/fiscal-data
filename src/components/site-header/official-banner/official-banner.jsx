import React from 'react';
import { container, officialBanner, text, flag } from './official-banner.module.scss';
import ExperimentalSwitch from '../../experimental/experimental-switch/experimental-switch';
import { StaticImage } from 'gatsby-plugin-image';

const OfficialBanner = () => {
  const officialBannerText = 'An official website of the U.S. government';
  return (
    <div className={container}>
      <div className={officialBanner} data-testid="officialBanner">
        <div className="empty">
          <ExperimentalSwitch />
        </div>
        <div className={text} data-testid="bannerText">
          {officialBannerText}
          <div className={flag} data-testid="bannerImage">
            <StaticImage src="../../../images/us_flag_small.png" title="small flag" alt="Small U.S. flag" placeholder="blurred" data-testid="flag" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialBanner;
