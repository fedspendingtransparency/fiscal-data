import React, { useEffect, useState } from "react";
import PageHelmet from "../../components/page-helmet/page-helmet";
import SiteLayout from "../../components/siteLayout/siteLayout";
import { Container, Grid } from "@material-ui/core";
import DataSourcesMethodologies from
    "../../layouts/explainer/data-sources-methodologies/data-sources-methodologies";
import * as styles from "./afg-overview.module.scss";
import { withWindowSize } from "react-fns";
import { pxToNumber } from "../../helpers/styles-helper/styles-helper";
import { breakpointLg } from "../../../src/variables.module.scss";
import { spendingExplainerPrimary } from
    "../../layouts/explainer/sections/federal-spending/federal-spending.module.scss";
import { debtExplainerPrimary } from
    "../../layouts/explainer/sections/national-debt/national-debt.module.scss";
import { deficitExplainerPrimary } from
    "../../layouts/explainer/sections/national-deficit/national-deficit.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill1Wave,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";
import AfgIcon from "../../layouts/explainer/explainer-components/afg-components/afg-icon/afg-icon";
import CompareSection from
    "../../layouts/explainer/explainer-components/afg-components/compare-section/compare-section";
import DeskTopSubNav from
    "../../layouts/explainer/explainer-components/explainer-sub-nav/explainer-sub-nav";
import MobileSubNav from "../../layouts/explainer/explainer-components/mobile-explainer-sub-nav/mobile-explainer-sub-nav";
import {apiPrefix, basicFetch} from "../../utils/api-utils";
import { getShortForm } from "../../utils/rounding-utils";
import AfgTopicSection from "../../layouts/explainer/explainer-components/afg-components/afg-topic-section/afg-topic-section";
import AfgHero from "../../layouts/explainer/explainer-components/afg-components/afg-hero/afg-hero";
import ApiRequest from "../../helpers/api-request";
import {
  debtRequest,
  deficitRequest,
  revenueRequest,
  spendingRequest,
} from "../../layouts/explainer/explainer-helpers/afg-overview-helpers";
import CustomLink from "../../components/links/custom-link/custom-link";
import GlossaryPopoverDefinition from "../../components/glossary/glossary-term/glossary-popover-definition";
import {graphql, useStaticQuery} from "gatsby";
import Footnote from "../../components/footnote/footnote";
import AnchorText from "../../components/anchor-text/anchor-text";
import { getAFGFootnotes } from "../../helpers/footnotes-helper/footnotes-helper";
import Analytics from "../../utils/analytics/analytics";

export const AmericasFinanceGuidePage = ({ width }) => {
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
      `,
  );

  const glossary  = allGlossary.allGlossaryCsv.glossaryCsv;
  glossary.map((term) => term.slug = term.term.toLowerCase().split(' ').join('-'));
  const [glossaryClickEvent, setGlossaryClickEvent] = useState(false);
  const [fiscalYear, setFiscalYear] = useState("");
  const [yearToDateRevenue, setYearToDateRevenue] = useState("");
  const [yearToDateSpending, setYearToDateSpending] = useState("");
  const [yearToDateDeficit, setYearToDateDeficit] = useState("");
  const [debt, setDebt] = useState("");
  const [latestDebt, setLatestDebt] = useState("");
  const [revenueHas, setRevenueHas] = useState('has collected');
  const [spendingHas, setSpendingHas] = useState('has');
  const [midPageHas, setMidPageHas] = useState('has');
  const [midPageAffect, setMidPageAffect] = useState('affected');
  const [deficitExceeds, setDeficitExceeds] = useState('exceeds');
  const [debtContributed, setDebtContributed] = useState('has contributed');
  const [debtDate, setDebtDate] = useState('month year');
  const [debtToPennyDate, setDebtToPennyDate] = useState('month DD, year');

  const handleCitizensGuideClick = () => {
    return Analytics.event({
      category: 'Explainers',
      action: 'Citation Click',
      label: 'AFG Overview - DS&M'
    });
  }

  useEffect(() => {
    basicFetch(new ApiRequest(revenueRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setYearToDateRevenue(
          getShortForm(data.current_fytd_net_rcpt_amt.toString(), false)
        );
        setFiscalYear(data.record_fiscal_year);
        if (data.record_calendar_month === '09') {
          setRevenueHas('collected');
        }
      }
    });
    basicFetch(new ApiRequest(spendingRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setYearToDateSpending(
          getShortForm(data.current_fytd_net_outly_amt.toString(), false)
        );
        if (data.record_calendar_month === '09') {
          setSpendingHas('');
          setMidPageHas('did');
          setMidPageAffect('affect');
        }
      }
    });
    basicFetch(new ApiRequest(deficitRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        const deficitAmount = Math.abs(Number(data.current_fytd_net_outly_amt));
        const formattedAmount = getShortForm(deficitAmount.toString(), false);
        setYearToDateDeficit(formattedAmount);
        if (data.record_calendar_month === '09') {
          setDeficitExceeds('exceeded');
        }
      }
    });
    const mtsDebtEndpoint = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694&sort=-record_date&page[size]=1';
    basicFetch(`${apiPrefix}${mtsDebtEndpoint}`).then(res => {
      if (res.data) {
        const mtsData = res.data[0];
        const mtsMonth = mtsData.record_calendar_month;
        const mspdDebtEndpoint = `v1/debt/mspd/mspd_table_1?filter=security_type_desc:eq:Total%20Public%20Debt%20Outstanding,record_calendar_month:eq:${mtsMonth}&sort=-record_date&page[size]=1`;
        basicFetch(`${apiPrefix}${mspdDebtEndpoint}`).then(res => {
          if (res.data) {
            const mspdData = res.data.find(entry => entry.record_calendar_month === mtsData.record_calendar_month);
            if (mspdData.record_calendar_month === '09') {
              setDebtContributed('contributed');
            }
            setLatestDebt(getShortForm((mspdData.total_mil_amt * 1000000).toString(), false));
            const date = new Date(mtsData.record_date);
            const monthName = date.toLocaleString('default', {month: 'long'});
            const year = mtsData.record_calendar_year;
            setDebtDate(`${monthName} ${year}`);
          }
        })
      }
    });
    basicFetch(new ApiRequest(debtRequest).getUrl()).then(res => {
      if (res.data) {
        const data = res.data[0];
        setDebt(getShortForm(data.tot_pub_debt_out_amt.toString(), false));
        const date = new Date(data.record_date);
        const monthName = date.toLocaleString('default', {month: 'long'});
        const debtToThePennyDay = data.record_calendar_day;
        setDebtToPennyDate(`${monthName} ${debtToThePennyDay}, ${data.record_calendar_year}`)
      }
    });
  }, []);

  const revenueHeading = (
    <>
      In fiscal year {fiscalYear}, the federal government {revenueHas} $
      {yearToDateRevenue} in{" "}
      <span style={{ fontStyle: "italic" }}>revenue.</span>
    </>
  );

  const spendingHeading = (
    <>
      In fiscal year {fiscalYear}, the federal government {spendingHas} {" "}
      <span style={{ fontStyle: "italic" }}>spent</span> ${yearToDateSpending}.
    </>
  );

  const anchorTextLatestFY = (FY, idx, anchorIdx) =>{
    const anchor = getAFGFootnotes(FY+1)[idx]
    return <AnchorText link={anchor.anchors[anchorIdx].link} text={anchor.anchors[anchorIdx].text} />
  }

  const deficitHeading = (
    <>
      The amount by which spending {deficitExceeds} revenue, ${yearToDateDeficit} in{" "}
      {fiscalYear}{anchorTextLatestFY(fiscalYear,0,1)}, is referred to as{" "}
      <span style={{ fontStyle: "italic" }}>deficit</span>
      {" "}spending.
    </>
  );
  const debtHeading = (
    <>
      The deficit this year {debtContributed} to a national{" "}
      <span style={{ fontStyle: "italic" }}>debt</span> of ${latestDebt} through {debtDate}.
    </>
  );

  const exciseTaxes =
    <GlossaryPopoverDefinition
      term={"Excise"}
      page={"Revenue Explainer & AFG Overview Page"}
      glossary={glossary}
      glossaryClickHandler={setGlossaryClickEvent}
    >
      excise
    </GlossaryPopoverDefinition>
  const mts = (
    <CustomLink
      url={"/datasets/monthly-treasury-statement/summary-of-receipts-outlays-and-the-deficit-surplus-of-the-u-s-government"}
      eventNumber={"9"}
    >
      Monthly Treasury Statement (MTS)
    </CustomLink>
  );
  const debtToThePenny = (
    <CustomLink
      url={
        "https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny"
      }
      eventNumber={"10"}
    >
      Debt to the Penny
    </CustomLink>
  );
  const citizensGuideLink = (
    <CustomLink
      url={"https://www.fiscal.treasury.gov/reports-statements/financial-report/current-report.html"}
    >
      Citizen's Guide to the Financial Report of the U.S. Government
    </CustomLink>
  );

  const revenueBody =
    <>
      The federal government collects revenue from a variety of sources, including individual
      income taxes, payroll taxes, corporate income taxes, and {exciseTaxes} taxes. It also collects
      revenue from services like admission to national parks and customs duties.
    </>
  const debtBody =
    <>
      The national debt is the money the federal government has borrowed to cover the outstanding
      balance of expenses incurred over time. To pay for a deficit, the federal government borrows
      additional funds, which increases the debt. Other activities contribute to the change in
      federal debt, such as changes in the Treasury’s operating cash account and federal student
      loans. The total debt for the US through {debtToPennyDate} is ${debt}.
      <br />
      <br />
      Are federal debt and deficit the same thing? No, but they do affect one another
    </>
  return (
    <SiteLayout isPreProd={false} glossaryEvent={glossaryClickEvent} glossaryClickEventHandler={setGlossaryClickEvent}>
      <PageHelmet
        pageTitle="America’s Finance Guide"
        description={"Your Guide to America’s Finances makes federal financial information open " +
        "and accessible to all. Explore U.S. revenue, spending, deficit, and debt with this " +
        "open-source guide to federal finance data."}
        keywords=""
        image=""
        canonical=""
        datasetDetails=""
      />
      <AfgHero />

      <div className={styles.mainContainer} >
        <Container
          classes={{ root: styles.topContainer }}
          maxWidth={false}
          data-testid="topContainer"
        >

          {width < pxToNumber(breakpointLg) ?
            <MobileSubNav hidePosition={1162} />
            :
            <DeskTopSubNav hidePosition={630} />}

          <AfgTopicSection
            heading={revenueHeading}
            body={revenueBody}
            linkUrl="/americas-finance-guide/government-revenue/"
            eventNumber={'4'}
            citationClickPage={'AfgOverview'}
            pageName={'RevenueExplainer'}
            linkText="Learn more about government revenue"
            linkColor={styles.revenueExplainerPrimary}
            image="/topics-section-images/homepage_revenue_1200x630.png"
            imageAltText="U.S. Capitol dome surrounded in circle by hand holding plant, hand
          holding money, hand holding gold coin, woman looking at check, and man looking
          at building."
          />

          <AfgTopicSection
            heading={spendingHeading}
            body="The federal government funds a variety of programs and services that support the American public. The government also spends money on interest it has incurred on outstanding federal debt, including Treasury notes and bonds."
            linkUrl="/americas-finance-guide/federal-spending/"
            linkText="Learn more about federal spending"
            linkColor={spendingExplainerPrimary}
            eventNumber={'5'}
            citationClickPage={'AfgOverview'}
            pageName={'SpendingExplainer'}
            image="/topics-section-images/homepage_spending_1200x630.png"
            imageAltText="The US Treasury building is placed next to a row of homes. A pair
          of hands exchange money in the foreground. "
          />

          <div className={styles.middleHeader}>
            <Grid container spacing={4}>
              <Grid item md={1} classes={{ root: styles.middleHeaderIcon }}>
                <AfgIcon
                  faIcon={faMoneyBill1Wave}
                  backgroundColor={styles.dollarIconBackgroundColor}
                  iconColor={styles.dollarIconColor}
                  altText={'Dark grey one dollar bill image overlaid on a grey circle.'}
                />
              </Grid>
              <Grid
                item
                md={11}
                classes={{ root: styles.middleHeaderHeadingContainer }}
              >
                <h3 className={styles.middleHeaderHeading}>
                  How {midPageHas} federal revenue and spending {midPageAffect} the{" "}
                  <span className={styles.deficitText}>deficit</span> and {" "}
                  <span className={styles.debtText}>debt</span> in fiscal
                  year {fiscalYear}?
                </h3>
              </Grid>
            </Grid>
          </div>


          <AfgTopicSection
            heading={deficitHeading}
            body="A budget deficit occurs when the money spent exceeds the money collected for a given period."
            linkUrl="/americas-finance-guide/national-deficit/"
            linkText="Learn more about national deficit"
            linkColor={deficitExplainerPrimary}
            eventNumber={'6'}
            citationClickPage={'AfgOverview'}
            pageName={'DeficitExplainer'}
            image="/topics-section-images/homepage_deficit_1200x630.png"
            imageAltText="A hand reaches up to grab a $ coin. Other objects appear to the left
          of the hand, including a pie chart, bar graph, and lit lightbulb."
          />

          <AfgTopicSection
            heading={debtHeading}
            body={debtBody}
            linkUrl="/americas-finance-guide/national-debt/"
            linkText="Learn more about national debt"
            linkColor={debtExplainerPrimary}
            eventNumber={'7'}
            citationClickPage={'AfgOverview'}
            pageName={'DebtExplainer'}
            image="/topics-section-images/homepage_debt_1200x630.png"
            imageAltText="A variety of hands reach up with objects, including a magnifying
          glass, a gold coin, a calculator, a pencil, a dollar bill, a clock, and a megaphone."
          />

          {fiscalYear && <CompareSection currentFiscalYear={fiscalYear} />}

          {fiscalYear && <Footnote footnotes={getAFGFootnotes(fiscalYear)} width="100%" />}
          <DataSourcesMethodologies pageName={'afg-overview'}>
            Current and prior fiscal year values for federal revenue, spending,
            and deficit are sourced from the {mts}. The {debtToThePenny} dataset is the
            data source for federal debt.
          </DataSourcesMethodologies>
        </Container>
      </div>
      <Container
        classes={{ root: styles.quoteContainer }}
        data-testid="quoteContainer"
      >
        <Grid classes={{ root: styles.quoteGrid }} container spacing={2}>
          <Grid item md={2} classes={{ root: styles.quoteContainerImg }}>
            <img
              src="../images/thomas-jefferson_background.png"
              alt="A sketched portrait of Thomas Jefferson, from the torso up."
            />
          </Grid>
          <Grid item md={8}>
            <p className={styles.quote}>
              We might hope to see the finances of the Union as clear and
              intelligible as a merchant’s books, so that every member of
              Congress, and every person of any mind in the Union should be able
              to comprehend them, to investigate abuses, and consequently to
              control them.
            </p>
            <p className={styles.citation}>
              Thomas Jefferson to Albert Gallatin, 1802 (edited)
            </p>
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
          Your Guide to America's Finances is a re-invention of the {citizensGuideLink}.{" "}
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
  );
};
export default withWindowSize(AmericasFinanceGuidePage);
