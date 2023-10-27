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
  } from './afg-hero-section.module.scss';
import { useWindowSize } from '../../../../../hooks/windowResize';
import ApiRequest from '../../../../../helpers/api-request';
import { revenueRequest } from '../../../explainer-helpers/afg-overview-helpers';
import { basicFetch } from '../../../../../utils/api-utils';
import AfgIcon from '../afg-icon/afg-icon';

export default function AfgHeroSection() {
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

  // useEffect(() => {
  //   setContainerHeight(refSocialShare.current.offsetTop + 466);
  // }, [width, height, containerHeight]);

  // const anchorTextCurrentFY = (FY, idx, anchorIdx) => {
  //   const anchor = getAFGFootnotes(FY + 1)[idx];
  //   return <AnchorText link={anchor.anchors[anchorIdx].link} text={anchor.anchors[anchorIdx].text} />;
  // };
  const afgIcon = '/images/AFG-icon.svg';

  return (
    <div className={heroContainer} data-testid="afg-hero">
      <div className={heroSkyImage} aria-label="Blue Sky." >
        <span>
          <div className={heroLibertyImage} aria-label="Statue of Liberty." />
        </span>
        <span className={textContainer}>
          <span className={heroAFG}>
            <img src={afgIcon} alt="An open book with a coin above the pages." className={heroIcon} />
            <div className={heroHeadText}>YOUR GUIDE TO AMERICA'S FINANCES</div>
          </span>
          <div className={heroMainText}>
            The Latest Data on Federal Revenue, Spending, Deficit, and the National Debt
          </div>
          <div className={heroSubText}>Understand the Basics of Federal Finances from the U.S. Treasury Department</div>
        </span>
      </div>
    </div>
  );
}
