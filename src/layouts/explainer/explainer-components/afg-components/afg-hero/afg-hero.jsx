import React, { useEffect, useState, useRef } from 'react'
import * as styles from './afg-hero.module.scss'
import { useWindowSize } from "../../../../../hooks/windowResize"
import {
  explainerAnalyticsLabelMap,
  explainerSocialShareMap,
} from "../../../explainer-helpers/explainer-helpers"
import SocialShare from "../../../../../components/social-share/social-share"
import ApiRequest from "../../../../../helpers/api-request";
import {revenueRequest} from "../../../explainer-helpers/afg-overview-helpers";
import {basicFetch} from "../../../../../utils/api-utils";
import { getAFGFootnotes } from "../../../../../helpers/footnotes-helper/footnotes-helper";
import AnchorText from "../../../../../components/anchor-text/anchor-text";

export default function AfgHero() {
  const [fiscalYear, setFiscalYear] = useState(0);
  const [width, height] = useWindowSize()
  const [containerHeight, setContainerHeight] = useState(765)
  const [headingTense, setHeadingTense] = useState('has');
  const [headingTenseCollect, setHeadingTenseCollect] = useState('collected');
  const [headingTenseSpend, setHeadingTenseSpend] = useState('spent');
  const pageName = "americas-finance-guide"

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
    setContainerHeight(refSocialShare.current.offsetTop + 466)
  }, [width, height, containerHeight])

  const anchorTextCurrentFY = (FY, idx, anchorIdx) =>{
    const anchor = getAFGFootnotes(FY+1)[idx];
    return <AnchorText link={anchor.anchors[anchorIdx].link} text={anchor.anchors[anchorIdx].text} />
  }

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
          government {headingTenseCollect} and {headingTenseSpend} in fiscal year {fiscalYear}{anchorTextCurrentFY(fiscalYear,0,0)}?
        </h1>
        <div className={styles.heroSocialShare} ref={refSocialShare}>
          <SocialShare
            copy={explainerSocialShareMap[pageName]}
            pageName={explainerAnalyticsLabelMap[pageName]}
            displayStyle={'horizontal'}
          />
        </div>
      </div>

    </div>
  )
}
