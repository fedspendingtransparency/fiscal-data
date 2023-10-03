import React from 'react';
import * as styles from './official-banner.module.scss';
import ExperimentalSwitch from '../../experimental/experimental-switch/experimental-switch';
import { StaticImage } from 'gatsby-plugin-image';

const OfficialBanner = () => {
  const officialBannerText = 'An official website of the U.S. government';
  return (
    <div className={styles.container}>
      <div className={styles.officialBanner} data-testid="officialBanner">
        <div className="empty">
          <ExperimentalSwitch />
        </div>
        <div className={styles.text} data-testid="bannerText">
          {officialBannerText}
          <div className={styles.flag} data-testid="bannerImage">
            <StaticImage src="../../../images/us_flag_small.png" title="small flag" alt="Small U.S. flag" placeholder="blurred" data-testid="flag" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialBanner;
