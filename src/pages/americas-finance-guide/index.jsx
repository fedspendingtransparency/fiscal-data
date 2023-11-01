import React, { useEffect, useState, useRef } from 'react';
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { Container, Grid } from '@material-ui/core';
import DataSourcesMethodologies from '../../layouts/explainer/data-sources-methodologies/data-sources-methodologies';
import {
  quoteIcon,
  quoteContainerIcon,
  bottomContainer,
  quote,
  quoteBar,
  citation,
  quoteGrid,
  topContainer,
  mainContainer,
  quoteContainer,
  quoteContainerImg,
  socialShare,
  quoteContainerQuote,
} from './afg-overview.module.scss';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../src/variables.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import DeskTopSubNav from '../../layouts/explainer/explainer-components/explainer-sub-nav/explainer-sub-nav';
import MobileSubNav from '../../layouts/explainer/explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav';
import { basicFetch } from '../../utils/api-utils';
import AfgHero from '../../layouts/explainer/explainer-components/afg-components/afg-hero/afg-hero';
import ApiRequest from '../../helpers/api-request';
import { revenueRequest } from '../../layouts/explainer/explainer-helpers/afg-overview-helpers';
import CustomLink from '../../components/links/custom-link/custom-link';
import { graphql, useStaticQuery } from 'gatsby';
import Footnote from '../../components/footnote/footnote';
import { getAFGFootnotes } from '../../helpers/footnotes-helper/footnotes-helper';
import TopicSection from '../../layouts/explainer/explainer-components/afg-components/topic-section/topic-section';
import { explainerAnalyticsLabelMap, explainerSocialShareMap } from '../../layouts/explainer/explainer-helpers/explainer-helpers';
import SocialShare from '../../components/social-share/social-share';
import { useWindowSize } from '../../hooks/windowResize';

const AmericasFinanceGuidePage = ({ width }) => {
  const allGlossary = useStaticQuery(
    graphql`
      query {
        allGlossaryCsv {
          glossaryCsv: nodes {
            term
            definition
            site_page
            id
            url_display
            url_path
          }
        }
      }
    `
  );
  const pageName = 'americas-finance-guide';
  const glossary = allGlossary.allGlossaryCsv.glossaryCsv;
  glossary.map(
    term =>
      (term.slug = term.term
        .toLowerCase()
        .split(' ')
        .join('-'))
  );
  const [glossaryClickEvent, setGlossaryClickEvent] = useState(false);
  const [fiscalYear, setFiscalYear] = useState('');
  const [height] = useWindowSize();
  const [containerHeight, setContainerHeight] = useState(765);
  const refSocialShare = useRef(0);

  const mts = (
    <CustomLink
      url="/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"
      eventNumber="9"
      id="Monthly Treasury Statement"
    >
      Monthly Treasury Statement (MTS)
    </CustomLink>
  );
  const debtToThePenny = (
    <CustomLink url="/datasets/debt-to-the-penny/debt-to-the-penny" eventNumber="10" id="Debt to the Penny">
      Debt to the Penny
    </CustomLink>
  );
  const mspd = (
    <CustomLink
      url="/datasets/monthly-statement-public-debt/summary-of-treasury-securities-outstanding"
      id="U.S. Treasury Monthly Statement of the Public Debt"
    >
      U.S. Treasury Monthly Statement of the Public Debt
    </CustomLink>
  );

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl()).then(res => {
      if (res.data) {
        setFiscalYear(res.data[0].record_fiscal_year);
      }
    });
  }, []);

  useEffect(() => {
    setContainerHeight(refSocialShare.current.offsetTop + 466);
  }, [width, height, containerHeight]);

  return (
    <SiteLayout isPreProd={false} glossaryEvent={glossaryClickEvent} glossaryClickEventHandler={setGlossaryClickEvent}>
      <PageHelmet
        pageTitle="America’s Finance Guide"
        description={
          'Your Guide to America’s Finances makes federal financial information open ' +
          'and accessible to all. Explore U.S. revenue, spending, deficit, and debt with this ' +
          'open-source guide to federal finance data.'
        }
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <AfgHero />
      <div className={mainContainer}>
        <Container classes={{ root: topContainer }} maxWidth={false} data-testid="topContainer">
          {width < pxToNumber(breakpointLg) ? <MobileSubNav hidePosition={1162} /> : <DeskTopSubNav hidePosition={630} />}
          <div className={socialShare} ref={refSocialShare}>
            <SocialShare copy={explainerSocialShareMap[pageName]} pageName={explainerAnalyticsLabelMap[pageName]} displayStyle={'horizontal'} />
          </div>
          <TopicSection glossary={glossary} fiscalYear={fiscalYear} setGlossaryClickEvent={setGlossaryClickEvent} width={width} />
          {fiscalYear && <Footnote footnotes={getAFGFootnotes(fiscalYear)} width="100%" />}
          <DataSourcesMethodologies pageName="afg-overview">
            Current and prior fiscal year values for federal revenue, spending, and deficit are sourced from the {mts}. The {mspd} and the{' '}
            {debtToThePenny} datasets are the data sources for federal debt.
          </DataSourcesMethodologies>
        </Container>
      </div>
      <Container classes={{ root: quoteContainer }} data-testid="quoteContainer">
        <Grid classes={{ root: quoteGrid }} container spacing={2} justifyContent="center" alignItems="center">
          <Grid item md={4} classes={{ root: quoteContainerImg }}>
            <img
              className="treasuryReportImg"
              src="../images/treasury-reports.png"
              alt="A spread of Fiscal Data reports laid upon the first article of the U.S. Constitution as the background. 
              Next to the spread is a quote from Article 1, Section 9, which reads 
              “A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.”"
            />
          </Grid>
          <Grid item md={4} classes={{ root: quoteContainerQuote }}>
            <p className={quote}>
              “A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.”
            </p>
            <p className={citation}>U.S. Constitution, Article 1, Section 9</p>
            <div className={quoteBar} />
          </Grid>
          <Grid item md={3} classes={{ root: quoteContainerIcon }}>
            <FontAwesomeIcon icon={faQuoteLeft} className={quoteIcon} />
          </Grid>
        </Grid>
      </Container>
      <Container classes={{ root: bottomContainer }} data-testid="bottomContainer">
        <p style={{ textAlign: 'center' }}>Your Guide to America's Finances is brought to you by the U.S. Department of the Treasury</p>
        <img src="../images/500px-Seal_of_the_United_States_Department_of_the_Treasury.svg" alt="U.S. Treasury Logo" />
      </Container>
    </SiteLayout>
  );
};
export default withWindowSize(AmericasFinanceGuidePage);
