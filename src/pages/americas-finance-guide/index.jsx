import React, { useEffect, useState } from "react"
import PageHelmet from "../../components/page-helmet/page-helmet"
import SiteLayout from "../../components/siteLayout/siteLayout"
import { Container, Grid, Box } from "@material-ui/core"
import DataSourcesMethodologies from "../../layouts/explainer/data-sources-methodologies/data-sources-methodologies"
import * as styles from "./afg-overview.module.scss"
import { withWindowSize } from 'react-fns'
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../src/variables.module.scss'
import { spendingExplainerPrimary } from "../../layouts/explainer/sections/federal-spending/federal-spending.module.scss"
import { debtExplainerPrimary } from "../../layouts/explainer/sections/national-debt/national-debt.module.scss"
import { deficitExplainerPrimary } from "../../layouts/explainer/sections/national-deficit/national-deficit.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMoneyBill1Wave,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons"
import TopicSection from "./afg-components/topic-section/topic-section"
import AfgIcon from "./afg-components/afg-icon/afg-icon"
import CompareSection from "./afg-components/compare-section/compare-section"
import DeskTopSubNav from '../../layouts/explainer/explainer-components/explainer-sub-nav/explainer-sub-nav';
import MobileSubNav from '../../layouts/explainer/explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav';
import { basicFetch } from "../../utils/api-utils"
import { getShortForm } from "../../layouts/explainer/heros/hero-helper"
import {
  explainerAnalyticsLabelMap,
  explainerSocialShareMap,
} from "../../layouts/explainer/explainer-helpers/explainer-helpers"
import SocialShare from "../../layouts/explainer/social-share/social-share"
import { useWindowSize } from "../../hooks/windowResize"
import ApiRequest from "../../helpers/api-request";
import {
  debtRequest,
  deficitRequest,
  revenueRequest,
  spendingRequest
} from "./afg-overview-helpers"


export function AmericasFinanceGuidePage({width}) {
  const [isMobile, setIsMobile] = useState(false)
  const [widthSize, height] = useWindowSize()
  const breakpoint = {
    desktop: 1015,
    tablet: 600,
  }
  useEffect(() => {
    const isMobile = window.innerWidth < breakpoint.desktop
    if (isMobile) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [widthSize, height])
  const pageName = "americas-finance-guide";

  const [fiscalYear, setFiscalYear] = useState('');
  const [yearToDateRevenue, setYearToDateRevenue] = useState('');
  const [yearToDateSpending, setYearToDateSpending] = useState('');
  const [yearToDateDeficit, setYearToDateDeficit] = useState('');
  const [debt, setDebt] = useState('');

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setYearToDateRevenue(getShortForm(data.current_fytd_net_rcpt_amt.toString(), 2, false));
          setFiscalYear(data.record_fiscal_year);
        }
      });
    basicFetch(new ApiRequest(spendingRequest).getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setYearToDateSpending(getShortForm(data.current_fytd_net_outly_amt.toString(), 2, false));
        }
      });
    basicFetch(new ApiRequest(deficitRequest).getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          const deficitAmount = Math.abs(Number(data.current_fytd_net_outly_amt));
          const formattedAmount = deficitAmount >= 1000000000000 ?
            getShortForm(deficitAmount.toString(), 2, false) :
            getShortForm(deficitAmount.toString(), 0, false);
          setYearToDateDeficit(formattedAmount);
        }
      });
    basicFetch(new ApiRequest(debtRequest).getUrl())
      .then((res) => {
        if (res.data) {
          const data = res.data[0];
          setDebt(getShortForm(data.tot_pub_debt_out_amt.toString(), 2, false));
        }
      });

  }, []);

  const revenueHeading =
    <>
      In fiscal year {fiscalYear}, the federal government has
      collected ${yearToDateRevenue} in <span style={{ fontStyle: 'italic' }}>revenue.</span>
    </>;

  const spendingHeading =
    <>
      In fiscal year {fiscalYear} the federal government
      has <span style={{ fontStyle: 'italic' }}>spent</span>,
      {' '} ${yearToDateSpending}.
    </>

  const deficitHeading =
    <>
      The amount by which spending exceeds revenue, ${yearToDateDeficit} in {fiscalYear}, is
      referred to as <span style={{ fontStyle: 'italic' }}>deficit.</span>
    </>
  const debtHeading =
    <>
      In {fiscalYear}, the federal government has ${debt} in
      federal <span style={{ fontStyle: 'italic' }}>debt.</span>
    </>
  return (
    <SiteLayout isPreProd={false}>
      <PageHelmet
        pageTitle="America’s Finance Guide"
        description="Your guide to America’s finances: explore U.S. revenue, spending, deficit, and debt with this accessible and open-source guide to federal finance data."
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <Container classes={{ root: styles.topContainer }}
                 maxWidth={false}
                 data-testid="topContainer"
      >
        <div className="heroSection" mb={5}>
          <h1>
            A regular Statement and Account of the Receipts and Expenditures of
            all public Money shall be published from time to time.
          </h1>
          <p>U.S. Constitution, Article 1, Section 9</p>
        </div>
        <Box
          my={5}
          style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "end",
            marginBottom: isMobile ? "0px" : "inherit",
          }}
        >
          {" "}
          <SocialShare
            title={explainerSocialShareMap[pageName].title}
            description={explainerSocialShareMap[pageName].description}
            body={explainerSocialShareMap[pageName].body}
            emailSubject={explainerSocialShareMap[pageName].emailSubject}
            emailBody={explainerSocialShareMap[pageName].emailBody}
            url={explainerSocialShareMap[pageName].url}
            image={explainerSocialShareMap[pageName].image}
            pageName={explainerAnalyticsLabelMap[pageName]}
            orientation={"horizontal"}
          />
        </Box>
        <Box my={5}>AFG Sub-navigation Bar </Box>

        {width < pxToNumber(breakpointLg) ? <MobileSubNav hidePosition={630} /> : <DeskTopSubNav hidePosition={630}/>}

        <TopicSection
          heading={revenueHeading}
          body="The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes, and excise taxes. It also collects revenue from services like admission to national parks and customs duties."
          linkUrl="./government-revenue"
          linkText="Learn more about government revenue"
          linkColor={styles.revenueExplainerPrimary}
          image="/topics-section-images/homepage_revenue_1200x630.png"
          imageAltText="U.S. Capitol dome surrounded in circle by hand holding plant, hand holding money, hand holding gold coin, woman looking at check, and man looking at building."
        />
        <TopicSection
          heading={spendingHeading}
          body="The federal government funds a variety of programs and services that support the American public. The federal government also spends money on interest it has incurred on outstanding federal debt, including Treasury notes and bonds."
          linkUrl="./federal-spending"
          linkText="Learn more about federal spending"
          linkColor={spendingExplainerPrimary}
          image="/topics-section-images/homepage_spending_1200x630.png"
          imageAltText="The US Treasury building is placed next to a row of homes. A pair of hands exchange money in the foreground. "
        />

        <div className={styles.middleHeader}>
          <Grid container spacing={4}>
            <Grid item md={1} classes={{ root: styles.middleHeaderIcon }}>
              <AfgIcon
                faIcon={faMoneyBill1Wave}
                backgroundColor={styles.fontBodyCopy}
              />
            </Grid>
            <Grid
              item
              md={11}
              classes={{ root: styles.middleHeaderHeadingContainer }}
            >
              <h3 className={styles.middleHeaderHeading}>How have federal revenue
                and spending affected the <span className={styles.deficitText}>deficit</span> and
                federal <span className={styles.debtText}>debt</span> so
                far in fiscal year {fiscalYear}?
              </h3>
            </Grid>
          </Grid>
        </div>

        <TopicSection
          heading={deficitHeading}
          body="A budget deficit occurs when the money spent exceeds the money collected for a given period."
          linkUrl="./national-deficit"
          linkText="Learn more about national deficit"
          linkColor={deficitExplainerPrimary}
          image="/topics-section-images/homepage_deficit_1200x630.png"
          imageAltText="A hand reaches up to grab a $ coin. Other objects appear to the left of the hand, including a pie chart, bar graph, and lit lightbulb."
        />
        <TopicSection
          heading={debtHeading}
          body="The national debt is the money the federal government has borrowed to cover the outstanding balance of expenses incurred over time. To pay for a deficit, the federal government borrows additional funds, which increases the debt. Other activities contribute to the change in federal debt, such as changes in the Treasury's operating cash account and federal student loans.

          Are federal debt and deficit the same thing? No, but they do affect one another"
          linkUrl="./national-debt"
          linkText="Learn more about national debt"
          linkColor={debtExplainerPrimary}
          image="/topics-section-images/homepage_debt_1200x630.png"
          imageAltText="A variety of hands reach up with objects, including a magnifying glass, a gold coin, a calculator, a pencil, a dollar bill, a clock, and a megaphone."
        />

        {fiscalYear && (<CompareSection currentFiscalYear={fiscalYear} />)}

        <DataSourcesMethodologies>
          Current and prior fiscal year values for federal revenue, spending,
          and deficit are sourced from the Monthly Treasury Statement (MTS).
          Current fiscal year values are updated monthly. The Monthly Statement
          of the Public Debt (MSPD)Debt to the Penny is the data source for
          federal debt. Current fiscal year values are updated daily.
        </DataSourcesMethodologies>
      </Container>
      <Container classes={{ root: styles.quoteContainer }} data-testid="quoteContainer">
          <Grid classes={{ root: styles.quoteGrid }} container spacing={2}>
            <Grid item md={2} classes={{ root: styles.quoteContainerImg }}>
              <img src="../images/thomas-jefferson_background.png"
                   alt="A sketched portrait of Thomas Jefferson, from the torso up."
              />
            </Grid>
            <Grid item md={8}>
              <p className={styles.quote}>
                We might hope to see the finances of the Union as clear and intelligible
                as a merchant’s books, so that every member of Congress, and every
                person of any mind in the Union should be able to comprehend them, to
                investigate abuses, and consequently to control them.
              </p>
              <p className={styles.citation}>Thomas Jefferson to Albert Gallatin, 1802 (edited)</p>
              <div className={styles.quoteBar} />
            </Grid>
            <Grid item md={2} classes={{ root: styles.quoteContainerIcon }}>
              <FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} />
            </Grid>
          </Grid>
      </Container>

      <Container
        classes={{ root: styles.bottomContainer }}
        data-testid="bottomContainer"
      >
        <p className={styles.bottomHeading}>Americans asked. We listened.</p>
        <p className={styles.bottomBody}>
          Your Guide to America's Finances is a re-invention of the{" "}
          <span className={styles.blueText}>
            {" "}
            Citizen's Guide to the Financial Report of the U.S. Government.
          </span>{" "}
          This site was created in response to the public's desire to learn more
          about the financial picture of the United States. Where does the money
          come from? Where does it go? What are the trends over time? This guide
          was created to make federal financial information open and accessible
          to all - reflecting the very principles that our founding fathers set
          forth when the United States was formed.
        </p>

        <p style={{ textAlign: "center" }}>
          Your Guide to America's Finances is brought to you by the U.S.
          Department of the Treasury
        </p>
        <img
          src="../images/500px-Seal_of_the_United_States_Department_of_the_Treasury.svg"
          alt="U.S. Treasury Logo"
        />
      </Container>
    </SiteLayout>
  )
}
export default withWindowSize(AmericasFinanceGuidePage)
