import React, { useEffect, useState, useRef } from 'react';
import * as styles from './afg-hero.module.scss';
import { useWindowSize } from '../../../../../hooks/windowResize';
import { explainerAnalyticsLabelMap, explainerSocialShareMap } from '../../../explainer-helpers/explainer-helpers';
import SocialShare from '../../../../../components/social-share/social-share';
import ApiRequest from '../../../../../helpers/api-request';
import { revenueRequest } from '../../../explainer-helpers/afg-overview-helpers';
import { basicFetch } from '../../../../../utils/api-utils';

export default function AfgHero() {
  const [fiscalYear, setFiscalYear] = useState(0);
  const [width, height] = useWindowSize();
  const [containerHeight, setContainerHeight] = useState(765);
  const [headingTense, setHeadingTense] = useState('has');
  const [headingTenseCollect, setHeadingTenseCollect] = useState('collected');
  const [headingTenseSpend, setHeadingTenseSpend] = useState('spent');
  const pageName = 'americas-finance-guide';

  const refSocialShare = useRef(0);

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setFiscalYear(data.record_fiscal_year);
        if (data.record_calendar_month === '09') {
          setHeadingTense('did');
          setHeadingTenseCollect('collect');
          setHeadingTenseSpend('spend');
        }
      }
    });
  }, []);

  useEffect(() => {
    setContainerHeight(refSocialShare.current.offsetTop + 466);
  }, [width, height, containerHeight]);

  return (
    <div className={styles.heroContainer} style={{ height: `${containerHeight}px` }} data-testid="afg-hero">
      <div className={styles.heroGrayBox} />
      <div className={styles.heroImageBox} aria-label="Statue of Liberty with blue sky."></div>
      <div className={styles.heroWhiteBox}>
        <h4 className={styles.heroGuideText}>YOUR GUIDE TO AMERICA’S FINANCES</h4>
        <h1 className={styles.heroHeading}>The Latest Data on Federal Revenue, Spending, Deficit, and the National Debt</h1>
        <h3 className={styles.heroGuideText}>Understand the Basics of Federal Finances from the U.S. Treasury Department</h3>
        <div className={styles.heroSocialShare} ref={refSocialShare}>
          <SocialShare copy={explainerSocialShareMap[pageName]} pageName={explainerAnalyticsLabelMap[pageName]} displayStyle={'horizontal'} />
        </div>
      </div>
    </div>
  );
}
