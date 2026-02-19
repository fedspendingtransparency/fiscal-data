import React, { useEffect, useRef, useState } from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { Container } from '@mui/material';
import DataSourcesMethodologies from '../../layouts/explainer/data-sources-methodologies/data-sources-methodologies';
import {
  bottomContainer,
  citation,
  constitutionImg,
  mainContainer,
  quote,
  quoteBar,
  quoteContainer,
  quoteIcon,
  quoteSection,
  socialShare,
  topContainer,
  treasuryReportImg,
} from './afg-overview.module.scss';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../src/variables.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons/faQuoteLeft';
import DeskTopSubNav from '../../layouts/explainer/explainer-components/explainer-sub-nav/explainer-sub-nav';
import MobileSubNav from '../../layouts/explainer/explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav';
import { basicFetch } from '../../utils/api-utils';
import AfgHero from '../../layouts/explainer/explainer-components/afg-components/afg-hero/afg-hero';
import ApiRequest from '../../helpers/api-request';
import { revenueRequest } from '../../layouts/explainer/explainer-helpers/afg-overview-helpers';
import Footnote from '../../components/footnote/footnote';
import { getAFGFootnotes } from '../../helpers/footnotes-helper/footnotes-helper';
import TopicSection from '../../layouts/explainer/explainer-components/afg-components/topic-section/topic-section';
import {
  explainerAnalyticsLabelMap,
  explainerCitationsMap,
  explainerSocialShareMap,
} from '../../layouts/explainer/explainer-helpers/explainer-helpers';
import SocialShare from '../../components/social-share/social-share';
import { useWindowSize } from '../../hooks/windowResize';
import GlossaryProvider from '../../components/glossary/glossary-context/glossary-context';

const AmericasFinanceGuidePage = ({ width }) => {
  const pageName = 'americas-finance-guide';

  const [fiscalYear, setFiscalYear] = useState('');
  const [height] = useWindowSize();
  const [containerHeight, setContainerHeight] = useState(765);
  const refSocialShare = useRef(0);

  const { mspdOutstanding, mtsSummary, debtToThePenny } = explainerCitationsMap['afg'];

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl()).then(res => {
      if (res.data) {
        setFiscalYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    if (refSocialShare.current) {
      setContainerHeight(refSocialShare.current.offsetTop + 466);
    }
  }, [width, height, containerHeight]);

  return (
    <GlossaryProvider>
      <SiteLayout isPreProd={false}>
        <AfgHero />
        <div className={mainContainer}>
          <Container classes={{ root: topContainer }} maxWidth={false} data-testid="topContainer">
            {width < pxToNumber(breakpointLg) ? <MobileSubNav hidePosition={1162} /> : <DeskTopSubNav hidePosition={630} />}
            <div className={socialShare} ref={refSocialShare}>
              <SocialShare copy={explainerSocialShareMap[pageName]} pageName={explainerAnalyticsLabelMap[pageName]} displayStyle="horizontal" />
            </div>
            <TopicSection fiscalYear={fiscalYear} width={width} />
            {fiscalYear && <Footnote footnotes={getAFGFootnotes(fiscalYear)} width="100%" />}
            <DataSourcesMethodologies pageName="afg-overview">
              Current and prior fiscal year values for federal revenue, spending, and deficit are sourced from the {mtsSummary}. The {mspdOutstanding}{' '}
              and the {debtToThePenny} datasets are the data sources for federal debt.
            </DataSourcesMethodologies>
          </Container>
        </div>
        <div className={constitutionImg} data-testid="quoteContainer">
          <div className={quoteContainer}>
            <img
              className={treasuryReportImg}
              src="../images/treasury-reports.png"
              alt="A spread of Fiscal Data reports laid upon the first article of the U.S. Constitution as the background.
                Next to the spread is a quote from Article 1, Section 9, which reads
                “A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.”"
            />
            <div className={quoteSection}>
              <p className={quote}>
                A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.
              </p>
              <p className={citation}>U.S. Constitution, Article 1, Section 9</p>
              <div className={quoteBar} />
            </div>
            <FontAwesomeIcon icon={faQuoteLeft} className={quoteIcon} />
          </div>
        </div>
        <Container classes={{ root: bottomContainer }} data-testid="bottomContainer">
          <p style={{ textAlign: 'center' }}>Your Guide to America's Finances is brought to you by the U.S. Department of the Treasury</p>
          <img src="../images/500px-Seal_of_the_United_States_Department_of_the_Treasury.svg" alt="U.S. Treasury Logo" />
        </Container>
      </SiteLayout>
    </GlossaryProvider>
  );
};
export default withWindowSize(AmericasFinanceGuidePage);

export const Head = () => (
  <PageHelmet
    pageTitle="America’s Finance Guide"
    description="Explore U.S. revenue, spending, deficit, and debt with this simple guide to federal financial data."
    keywords="america's finance guide, us treasury, fiscal data, us government financial data, debt, deficit, revenue, spending"
    socialShare={explainerSocialShareMap['americas-finance-guide']}
  />
);
