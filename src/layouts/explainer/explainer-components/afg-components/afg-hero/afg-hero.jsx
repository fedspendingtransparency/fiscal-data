import React, { useEffect, useState, useRef } from 'react'
import * as styles from './afg-hero.module.scss'
import { useWindowSize } from "../../../../../hooks/windowResize"
import {
  explainerAnalyticsLabelMap,
  explainerSocialShareMap,
} from "../../../explainer-helpers/explainer-helpers"
import SocialShare from "../../../social-share/social-share"
import ApiRequest from "../../../../../helpers/api-request";
import {revenueRequest} from "../../../explainer-helpers/afg-overview-helpers";
import {basicFetch} from "../../../../../utils/api-utils";

export default function AfgHero() {
  const [isMobile, setIsMobile] = useState(false)
  const [fiscalYear, setFiscalYear] = useState(0);
  const [width, height] = useWindowSize()
  const [containerHeight, setContainerHeight] = useState(765)
  const [headingTense, setHeadingTense] = useState('has');
  const [headingTenseCollect, setHeadingTenseCollect] = useState('collected');
  const [headingTenseSpend, setHeadingTenseSpend] = useState('spent');
  const pageName = "americas-finance-guide"
  const breakpoint = {
    desktop: 1015,
    tablet: 600,
  }

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
    const isMobile = window.innerWidth < breakpoint.desktop
    if (isMobile) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }

    setContainerHeight(refSocialShare.current.offsetTop + 466)
  }, [width, height, containerHeight])

  return (
    <div className={styles.heroContainer} style={{height: `${containerHeight}px`}}
         data-testid="afg-hero"
    >
      <div className={styles.heroGrayBox} />
      <div className={styles.heroImageBox} aria-label="Statue of Liberty with blue sky.">
        <h3 className={styles.heroQuote}>
          “A regular Statement and Account of the Receipts and Expenditures of all public Money
          shall be published from time to time.”
        </h3>
        <p className={styles.heroCitation}>U.S. Constitution, Article 1, Section 9</p>
      </div>
      <div className={styles.heroWhiteBox}>
        <h4 className={styles.heroGuideText}>YOUR GUIDE TO AMERICA’S FINANCES</h4>
        <h1 className={styles.heroHeading}>How much money {headingTense} the federal
          government {headingTenseCollect} and {headingTenseSpend} in fiscal year {fiscalYear}?
        </h1>
        <div className={styles.heroSocialShare} ref={refSocialShare}>
          <SocialShare
            title={explainerSocialShareMap[pageName].title}
            description={explainerSocialShareMap[pageName].description}
            body={explainerSocialShareMap[pageName].body}
            emailSubject={explainerSocialShareMap[pageName].emailSubject}
            emailBody={explainerSocialShareMap[pageName].emailBody}
            url={explainerSocialShareMap[pageName].url}
            image={explainerSocialShareMap[pageName].image}
            pageName={explainerAnalyticsLabelMap[pageName]}
            horizontal={true}
          />
        </div>
      </div>

    </div>
  )
}
