import React, { useEffect, useState } from "react"
import PageHelmet from "../../components/page-helmet/page-helmet"
import SiteLayout from "../../components/siteLayout/siteLayout"
import { Container, Grid, Box } from "@material-ui/core"
import DataSourcesMethodologies from "../../layouts/explainer/data-sources-methodologies/data-sources-methodologies"
import * as styles from "./afg-overview.module.scss"
import { spendingExplainerPrimary } from "../../layouts/explainer/sections/federal-spending/federal-spending.module.scss"
import { debtExplainerPrimary } from "../../layouts/explainer/sections/national-debt/national-debt.module.scss"
import { deficitExplainerPrimary } from "../../layouts/explainer/sections/national-deficit/national-deficit.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faMoneyBill1Wave,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons"
import AfgTopicSection from "./afg-components/afg-topic-section/afg-topic-section"
import AfgIcon from "./afg-components/afg-icon/afg-icon"
import CompareSection from "./afg-components/compare-section/compare-section"

import { useWindowSize } from "../../hooks/windowResize"
import AfgHero from "./afg-components/afg-hero/afg-hero"

export default function AmericasFinanceGuidePage() {  
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
      <AfgHero/>
      <Container classes={{ root: styles.topContainer }} maxWidth={false} data-testid="topContainer">
        
        <Box my={5}>AFG Sub-navigation Bar </Box>

        <AfgTopicSection
          heading={[
            "In fiscal year YYYY, the federal government has collected $X.X in ",
            <span style={{ fontStyle: "italic" }}>revenue.</span>,
          ]}
          body="The federal government collects revenue from a variety of sources, including individual income taxes, payroll taxes, corporate income taxes, and excise taxes. It also collects revenue from services like admission to national parks and customs duties."
          linkUrl="/americas-finance-guide/government-revenue/"
          linkText="Learn more about government revenue"
          linkColor={styles.revenueExplainerPrimary}
          image="/topics-section-images/homepage_revenue_1200x630.png"
          imageAltText="U.S. Capitol dome surrounded in circle by hand holding plant, hand holding money, hand holding gold coin, woman looking at check, and man looking at building."
        />
        <AfgTopicSection
          heading={[
            "In fiscal year YYYYY the federal government has ",
            <span style={{ fontStyle: "italic" }}>spent.</span>,
            " $X.X.",
          ]}
          body="The federal government funds a variety of programs and services that support the American public. The federal government also spends money on interest it has incurred on outstanding federal debt, including Treasury notes and bonds."
          linkUrl="/americas-finance-guide/federal-spending/"
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
              <h3 className={styles.middleHeaderHeading}>
                How have federal revenue and spending affected the{" "}
                <span className={styles.deficitText}>deficit</span> and federal{" "}
                <span className={styles.debtText}>debt</span> so far in fiscal
                year YYYY?{" "}
              </h3>
            </Grid>
          </Grid>
        </div>

        <AfgTopicSection
          heading={[
            "The amount by which spending exceeds revenue, $X.X in YYYY, is referred to as ",
            <span style={{ fontStyle: "italic" }}>deficit.</span>,
          ]}
          body="A budget deficit occurs when the money spent exceeds the money collected for a given period."
          linkUrl="/americas-finance-guide/national-deficit/"
          linkText="Learn more about national deficit"
          linkColor={deficitExplainerPrimary}
          image="/topics-section-images/homepage_deficit_1200x630.png"
          imageAltText="A hand reaches up to grab a $ coin. Other objects appear to the left of the hand, including a pie chart, bar graph, and lit lightbulb."
        />
        <AfgTopicSection
          heading={[
            "In YYYY, the federal government has $X.X in federal ",
            <span style={{ fontStyle: "italic" }}>debt.</span>,
          ]}
          body="The national debt is the money the federal government has borrowed to cover the outstanding balance of expenses incurred over time. To pay for a deficit, the federal government borrows additional funds, which increases the debt. Other activities contribute to the change in federal debt, such as changes in the Treasury's operating cash account and federal student loans.  

          Are federal debt and deficit the same thing? No, but they do affect one another"
          linkUrl="/americas-finance-guide/national-debt/"
          linkText="Learn more about national debt"
          linkColor={debtExplainerPrimary}
          image="/topics-section-images/homepage_debt_1200x630.png"
          imageAltText="A variety of hands reach up with objects, including a magnifying glass, a gold coin, a calculator, a pencil, a dollar bill, a clock, and a megaphone."
        />

        <CompareSection />

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
              <img src="../images/thomas-jefferson_background.png" alt="A sketched portrait of Thomas Jefferson, from the torso up." />
            </Grid>
            <Grid item md={8}>
              <p className={styles.quote}>We might hope to see the finances of the Union as clear and intelligible as a merchant’s books, so that every member of Congress, and every person of any mind in the Union should be able to comprehend them, to investigate abuses, and consequently to control them. </p>
              <p className={styles.citation}>Thomas Jefferson to Albert Gallatin, 1802 (edited)</p>
              <div className={styles.quoteBar}></div>
            </Grid>
            <Grid item md={2} classes={{ root: styles.quoteContainerIcon }}><FontAwesomeIcon icon={faQuoteLeft} className={styles.quoteIcon} /></Grid>
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
