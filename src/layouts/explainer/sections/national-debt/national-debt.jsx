import React, { useEffect, useState } from "react";
import { withWindowSize } from "react-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faHandHoldingMedical,
  faHeartbeat,
  faShieldAlt,
  faUserFriends,
  faFlagUsa,
} from "@fortawesome/free-solid-svg-icons";

import Accordion from "../../../../components/accordion/accordion";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import { apiPrefix, basicFetch } from "../../../../utils/api-utils";
import { datasetSectionConfig } from "../../explainer-helpers/explainer-helpers";
import {
  breakpointSm,
  debtExplainerPrimary,
  debtExplainerLightSecondary,
} from "../../../../variables.module.scss";
import { pxToNumber } from "../../../../helpers/styles-helper/styles-helper";
import alexanderHamilton from "../../../../images/alexander-hamilton.png";
import benFranklin from "../../../../images/ben-franklin.png";
import { KeyTakeawaysSection } from "./key-takeaways/national-debt-key-takeaways";

import {
  icon,
  // NationalDebtExplained
  rectangle,
  accordionHeader,
  accordionTable,
  accordionFooter,
  // Funding Programs & Services
  spendingCategoriesAccordionContent,
  spendingCategoriesTable,
  row,
  firstColumn,
  secondColumn,
  // Growing National Debt
  growingNationalDebt,
  growingNationalDebtSectionAccordion,
  // Dive Deeper Section
  diveDeeperQuoteRight,
  diveDeeperQuoteLeft,
  diveDeeperLink,
  diveDeeperQuote,
  diveDeeperCitation,
  //Accordion styling
  debtAccordion,
  fundingProgramAccordion,
  debtCeilingAccordion,
  postGraphAccordionContainer,
} from "./national-debt.module.scss";
import GlossaryTerm from "../../../../components/glossary-term/glossary-term";
import Analytics from "../../../../utils/analytics/analytics";
import QuoteBox from "../../quote-box/quote-box";
import DebtOverLast100y
  from "./growing-national-debt/debt-over-last-100y-linechart/debt-over-last-100y-linechart"
import {DebtTrendsOverTimeChart}
  from "./growing-national-debt/debt-trends-over-time/debt-trends-over-time-chart";
import NationalDebtExplained from "./national-debt-explained/national-debt-explained";
import useBeaGDP from "../../../../hooks/useBeaGDP";
import BreakingDownTheDebt from "./breaking-down-the-debt/breaking-down-the-debt";

export const nationalDebtSectionConfigs = datasetSectionConfig["national-debt"];

export const nationalDebtSectionIds = [
  "key-takeaways",
  "the-national-debt-explained",
  "funding-programs-and-services",
  "the-growing-national-debt",
  "breaking-down-the-debt",
  "the-debt-ceiling",
  "tracking-the-debt",
  "dive-deeper-into-the-debt",
];
export const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

export const deficitLink = (
  <CustomLink url={'/americas-finance-guide/national-deficit/'} >
    deficit
  </CustomLink>
);

export const spendingLink = (copy) => (
  <CustomLink url={'/americas-finance-guide/federal-spending/'} >
    {copy}
  </CustomLink>
);



export const visualizingTheDebtTableContent = {
  desktop: {
    rows: 20,
    columns: 50,
  },
  mobile: {
    rows: 50,
    columns: 20,
  },
};

export const chartPatternBackground = "#4A0072";



export const FundingProgramsSection = () => {
  const usaSpending = (
    <CustomLink
      url={"https://www.usaspending.gov/"}
      onClick={() =>
        analyticsClickHandler("Citation Click", "Funding Programs & Services")
      }
    >
      USAspending.gov
    </CustomLink>
  );

  const usaSpending_majorSpendingCategories = (
    <CustomLink
      url={"https://www.usaspending.gov/"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      USAspending.gov
    </CustomLink>
  );

  const objectClass = (
    <CustomLink
      url={"https://www.usaspending.gov/#/explorer/object_class"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      Object Class
    </CustomLink>
  );

  const budgetFunction = (
    <CustomLink
      url={"https://www.usaspending.gov/explorer/budget_function"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      Budget Function
    </CustomLink>
  );

  const revenueLink = (
    <CustomLink url={'/americas-finance-guide/government-revenue/'} >
      federal revenues
    </CustomLink>
  )

  return (
    <>
      <p>
        The federal government needs to borrow money to pay its bills when its
        ongoing {spendingLink('spending')} activities and investments cannot be funded
        by {revenueLink} alone. Decreases in federal revenue are largely due to either a
        decrease in tax rates or individuals or corporations making less money.
        The national debt enables the federal government to pay for important
        programs and services even if it does not have funds immediately
        available, often due to a decrease in revenue. Decreases in federal
        revenue coupled with increased government spending further increases the {deficitLink}.
      </p>
      <p>
        Consistent with the purpose of the federal government established by the
        U.S. Constitution, money is spent on programs and services to ensure the
        well-being of U.S. residents. The Constitution’s preamble states that
        the purpose of the federal government is “…to establish Justice, insure
        domestic Tranquility, provide for the common defense, promote the
        general Welfare, and secure the Blessings of Liberty to ourselves and
        our Posterity.” Uninterrupted funding of programs and services is
        critical to residents’ health, welfare, and security.
      </p>
      <div className={debtAccordion}>
        <Accordion
          title="What are some of the major spending categories?"
          altStyleAccordion={{ padding: "9px 16px" }}
          containerClass={fundingProgramAccordion}
          openEventNumber={"11"}
          closeEventNumber={"12"}
          explainerGAEvent="Debt"
        >
          <div className={spendingCategoriesAccordionContent}>
            <p>
              Below are some of the federal government’s largest spending
              categories. Visit {usaSpending_majorSpendingCategories} to explore
              federal spending by the types of items and services purchased by
              the federal government. Explore federal spending by {objectClass}{" "}
              or learn how spending categories and subcategories break down by
              viewing federal spending by {budgetFunction}.
            </p>
            <div className={spendingCategoriesTable}>
              <div className={row}>
                <div className={firstColumn}>
                  <FontAwesomeIcon icon={faDollarSign} className={icon} />
                </div>
                <div className={secondColumn}>
                  <strong>Income Security</strong>
                  <p>
                    Supports programs such as unemployment compensation, federal
                    employee retirement and disability, and food and nutrition
                    assistance; spending for this program increased during the
                    COVID-19 pandemic because of the CARES Act and American
                    Rescue Plan Act
                  </p>
                </div>
              </div>
              <div className={row}>
                <div className={firstColumn}>
                  <FontAwesomeIcon icon={faUserFriends} className={icon} />
                </div>
                <div className={secondColumn}>
                  <strong>Social Security</strong>
                  <p>
                    Supports programs for beneficiaries including retirement,
                    disability insurance, and supplemental security income
                    payments
                  </p>
                </div>
              </div>
              <div className={row}>
                <div className={firstColumn}>
                  <FontAwesomeIcon icon={faHeartbeat} className={icon} />
                </div>
                <div className={secondColumn}>
                  <strong>Health</strong>
                  <p>
                    Supports spending for programs related to health care
                    services, health research and training, and consumer and
                    occupational health and safety, except for Medicare which
                    has its own category
                  </p>
                </div>
              </div>
              <div className={row}>
                <div className={firstColumn}>
                  <FontAwesomeIcon icon={faShieldAlt} className={icon} />
                </div>
                <div className={secondColumn}>
                  <strong>National Defense</strong>
                  <p>
                    Supports spending related to the military and
                    defense-related activities
                  </p>
                </div>
              </div>
              <div className={row}>
                <div className={firstColumn}>
                  <FontAwesomeIcon
                    icon={faHandHoldingMedical}
                    className={icon}
                  />
                </div>
                <div className={secondColumn}>
                  <strong>Medicare</strong>
                  <p>
                    Supports spending programs providing health insurance for
                    people such as those aged 65 or older and certain younger
                    people with disabilities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
      <QuoteBox
        icon={faFlagUsa}
        primaryColor={debtExplainerPrimary}
        secondaryColor={debtExplainerLightSecondary}
        customTopMargin={"0"}
      >
        <p>
          In accordance with the 2014 DATA Act, federal agencies are required to
          submit financial data on a quarterly and/or monthly basis to{" "}
          {usaSpending}. Anyone can visit USAspending for a breakdown of what
          the federal government spends each year and how it spends that money.
          Visitors can follow the money from the Congressional appropriations to
          the federal agencies and down to local communities and businesses.
        </p>
      </QuoteBox>
    </>
  );
};

export const VisualizingTheDebtAccordion = ({ width }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(visualizingTheDebtTableContent.desktop.rows);
  const [columns, setColumns] = useState(
    visualizingTheDebtTableContent.desktop.columns
  );
  const [nationalDebtValue, setNationalDebtValue] = useState(
    "99999999999999.99"
  );
  const [nationalDebtValueInTenths, setNationalDebtValueInTenths] = useState(
    "99999999999999.9"
  );
  const [numberOfSquares, setNumberOfSquares] = useState("0");
  const [dynamicGaEventValue, setDynamicGaEventValue] = useState(null);
  useEffect(() => {
    setIsLoading(false);

    if (width < pxToNumber(breakpointSm)) {
      setRows(visualizingTheDebtTableContent.mobile.rows);
      setColumns(visualizingTheDebtTableContent.mobile.columns);
    } else {
      setRows(visualizingTheDebtTableContent.desktop.rows);
      setColumns(visualizingTheDebtTableContent.desktop.columns);
    }
  }, [width]);

  const drawTable = () => {
    const table = [];

    for (let i = 0; i < rows; i++) {
      const row = [];

      for (let j = 0; j < columns; j++) {
        row.push(j);
      }

      table.push(
        <tr key={i} data-testid="accordion-table-row">
          {row.map(index => (
            <td key={index} className={rectangle} />
          ))}
        </tr>
      );
    }

    return <tbody>{table.map(tr => tr)}</tbody>;
  };

  const fields = "fields=tot_pub_debt_out_amt,record_date";
  const sort = "sort=-record_date";
  const pagination = "page[size]=1&page[number]=1";
  const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      if (res.data) {
        const totalPublicDebtOutstanding = Math.trunc(
          res.data[0]["tot_pub_debt_out_amt"]
        );
        const dividedDebt = totalPublicDebtOutstanding / 1000000000000;
        setNationalDebtValue(dividedDebt.toFixed());
        setNationalDebtValueInTenths(dividedDebt.toFixed(1));
        setDynamicGaEventValue(dividedDebt.toFixed());
        setNumberOfSquares(
          (dividedDebt * 1000).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        );
      }
    });
  }, []);

  return (
    <div className={debtAccordion}>
      <Accordion
        title={`Visualizing the debt - How much is $${nationalDebtValue} trillion dollars?`}
        containerClass={growingNationalDebtSectionAccordion}
        openEventNumber={"20"}
        closeEventNumber={"21"}
        dynamicGaEventValue={dynamicGaEventValue}
        explainerGAEvent="Debt"
      >
        <div className={accordionHeader}>
          <p>If this is 1 billion:</p>
          <div className={rectangle} />
          <p>Then this is 1 trillion:</p>
        </div>
        {!isLoading && <table className={accordionTable}>{drawTable()}</table>}
        <div className={accordionFooter}>
          <p>(1000 squares drawn to scale.)</p>
          <p>
            {`Today's debt is $${nationalDebtValueInTenths} T. That's ${numberOfSquares} squares!`}
          </p>
        </div>
      </Accordion>
    </div>
  );
};

export const GrowingNationalDebtSection = withWindowSize(
  ({ sectionId, glossary, cpiDataByYear, width }) => {
    const beaGDPData = useBeaGDP(cpiDataByYear);
    const gdp = (
      <GlossaryTerm
        term="Gross Domestic Product (GDP)"
        page="Debt explainer"
        glossary={glossary}
      >
        gross domestic product (GDP)
      </GlossaryTerm>
    );

    return (
      <div className={growingNationalDebt}>
        <p>
          The U.S. has carried debt since its inception. Debts incurred during
          the American Revolutionary War amounted to over $75 million by January
          1, 1791. Over the next 45 years, the debt continued to grow until 1835
          when it notably shrank due to the sale of federally-owned lands and
          cuts to the federal budget. Shortly thereafter, an economic depression
          caused the debt to again grow into the millions. The debt grew over
          4,000% through the course of the American Civil War, increasing from
          $65 million in 1860 to $1 billion in 1863 and around $2.7 billion
          shortly after the conclusion of the war in 1865. The debt grew
          steadily into the 20th century and was roughly $22 billion after the
          country financed its involvement in World War I.
        </p>
        <p>
          Notable recent events triggering large spikes in the debt include the
          Afghanistan and Iraq Wars, the 2008 Great Recession, and the COVID-19
          pandemic. From FY 2019 to FY 2021, {spendingLink('spending')} increased by about 50%,
          largely due to the COVID-19 pandemic. Tax cuts, stimulus programs,
          increased government spending, and decreased tax revenue caused by
          widespread unemployment generally account for sharp rises in the
          national debt.
        </p>
        {!beaGDPData.isGDPLoading && (
          <DebtOverLast100y
            cpiDataByYear={cpiDataByYear}
            beaGDPData={beaGDPData}
          />
        )}
        <p>
          Comparing a country’s debt to its {gdp} reveals the country’s ability
          to pay down its debt. This ratio is considered a better indicator of a
          country’s fiscal situation than just the national debt number because
          it shows the burden of debt relative to the country’s total economic
          output and therefore its ability to repay it. The U.S. debt to GDP
          ratio surpassed 100% in 2013 when both debt and GDP were approximately
          16.7 trillion.
        </p>
        {!beaGDPData.isGDPLoading && (
        <DebtTrendsOverTimeChart sectionId={sectionId} beaGDPData={beaGDPData} width={width} />
        )}
        <div className={postGraphAccordionContainer}>
          <VisualizingTheDebtAccordion width={width} />
        </div>
      </div>
    );
  }
);

export const percentageFormatter = value =>
  (Math.round(Number(value) * 100).toPrecision(15) / 100).toFixed(2) + "%";
export const trillionsFormatter = value =>
  `$${(Number(value) / 1000000).toFixed(2)} T`;



export const debtCeilingSectionAccordionTitle =
  "How is the debt ceiling different from a government shutdown?";

export const DebtCeilingSection = () => (
  <>
    <p>
      The debt ceiling, or debt limit, is a restriction imposed by Congress on
      the amount of outstanding national debt that the federal government can
      have. The debt ceiling is the amount that the Treasury can borrow to pay
      the bills that have become due and pay for future investments. Once the
      debt ceiling is reached, the federal government cannot increase the amount
      of outstanding debt, losing the ability to pay bills and fund programs and
      services. However, the Treasury can use extraordinary measures authorized
      by Congress to temporarily suspend certain intragovernmental debt allowing
      it to borrow to fund programs or services for a limited amount of time
      after it has reached the ceiling.
    </p>
    <p>
      Since the United States has never defaulted on its obligations, the scope
      of the negative repercussions related to a default are unknown but would
      likely have catastrophic repercussions in the United States and in markets
      across the globe.
    </p>
    <div className={debtAccordion}>
      <Accordion
        title={debtCeilingSectionAccordionTitle}
        containerClass={debtCeilingAccordion}
        openEventNumber="28"
        closeEventNumber="29"
        explainerGAEvent="Debt"
      >
        Government shutdowns occur when annual funding for ongoing federal
        government operations expires, and Congress does not renew it in time.
      </Accordion>
    </div>
  </>
);

export const DebtTrackingSection = () => {
  const fiscalService = (
    <CustomLink
      url={"https://www.fiscal.treasury.gov/"}
      onClick={() =>
        analyticsClickHandler("Citation Click", "Tracking the Debt")
      }
    >
      Bureau of the Fiscal Service
    </CustomLink>
  );

  return (
    <>
      <p>
        Created in 2012 and operating under the Department of the Treasury, the{" "}
        {fiscalService} manages all federal payments and collections and
        provides government-wide accounting and reporting services. A primary
        function of the Fiscal Service is to account for and report the national
        debt, as dictated by the U.S. Constitution, which states that “regular
        Statement and Account of the Receipts and Expenditures of all public
        Money shall be published from time to time.”
      </p>
    </>
  );
};

export const DiveDeeperSection = () => (
  <>
    <p>
      For more information about the national debt, please explore more of
      Fiscal Data and check out the extensive resources listed below.
    </p>
    <div className={diveDeeperLink}>
      <div className={diveDeeperLink}>
        <strong>The most recent U.S. Government Financial Report</strong>
        <br />
        <CustomLink
          url={
            "https://fiscaldata.treasury.gov/static-data/published-reports/frusg/FRUSG_2021.pdf"
          }
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://fiscaldata.treasury.gov/static-data/published-reports/frusg/FRUSG_2021.pdf
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>America’s Fiscal Future: Federal Debt</strong>
        <br />
        <CustomLink
          url={"https://www.gao.gov/americas-fiscal-future/federal-debt"}
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.gao.gov/americas-fiscal-future/federal-debt
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>{"The Debt Ceiling: An Explainer\n"}</strong>
        <br />
        <CustomLink
          url={
            "https://www.whitehouse.gov/cea/written-materials/2021/10/06/the-debt-ceiling-" +
            "an-explainer/"
          }
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.whitehouse.gov/cea/written-materials/2021/10/06/the-debt-ceiling-an-explainer/
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>{"Federal Borrowing and Debt\n"}</strong>
        <br />
        <CustomLink
          url={
            "https://www.whitehouse.gov/wp-content/uploads/2021/05/ap_4_borrowing_fy22.pdf"
          }
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.whitehouse.gov/wp-content/uploads/2021/05/ap_4_borrowing_fy22.pdf
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>Federal Net Interest Costs: A Primer</strong>
        <br />
        <CustomLink
          url={"https://www.cbo.gov/publication/56910"}
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.cbo.gov/publication/56910
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>
          Is the Federal Reserve Printing Money in Order to Buy Treasury
          Securities?
        </strong>
        <br />
        <CustomLink
          url={"https://www.federalreserve.gov/faqs/money_12853.htm"}
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.federalreserve.gov/faqs/money_12853.htm
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>Options for Reducing Deficit</strong>
        <br />
        <CustomLink
          url={"https://www.cbo.gov/publication/56783"}
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.cbo.gov/publication/56783
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>Treasury Bulletin</strong>
        <br />
        <CustomLink
          url={
            "https://fiscal.treasury.gov/reports-statements/treasury-bulletin/"
          }
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://fiscal.treasury.gov/reports-statements/treasury-bulletin/
        </CustomLink>
      </div>

      <div className={diveDeeperLink}>
        <strong>USAspending</strong>
        <br />
        <CustomLink
          url={"https://www.usaspending.gov"}
          onClick={() =>
            analyticsClickHandler("Citation Click", "Dive Deeper into the Debt")
          }
        >
          https://www.usaspending.gov
        </CustomLink>
      </div>
    </div>

    <div className={diveDeeperQuoteRight}>
      <img src={benFranklin} alt="" />
      <div>
        <div className={diveDeeperQuote}>
          “Rather go to bed without dinner than to rise in debt.”
        </div>
        <div className={diveDeeperCitation}>
          Benjamin Franklin, statesman, civic leader, and diplomat
        </div>
      </div>
    </div>
    <div className={diveDeeperQuoteLeft}>
      <div>
        <div className={diveDeeperQuote}>
          “The necessity for borrowing in particular emergencies cannot be
          doubted, so on the other, it is equally evident that, to be able to
          borrow upon good terms, it is essential that the credit of the nation
          should be well established.”
        </div>
        <div className={diveDeeperCitation}>
          Alexander Hamilton, 1st U.S. Treasury Secretary
        </div>
      </div>
      <img src={alexanderHamilton} alt="" />
    </div>
  </>
);

const nationalDebtSections = [
  {
    index: 0,
    id: nationalDebtSectionIds[0],
    title: "Key Takeaways",
    component: (glossary, cpiDataByYear) => (
      <KeyTakeawaysSection glossary={glossary} />
    ),
  },
  {
    index: 1,
    id: nationalDebtSectionIds[1],
    title: "The National Debt Explained",
    component: (glossary, cpiDataByYear) => (
      <NationalDebtExplained glossary={glossary} />
    ),
  },
  {
    index: 2,
    id: nationalDebtSectionIds[2],
    title: "Funding Programs & Services",
    component: (glossary, cpiDataByYear) => (
      <FundingProgramsSection glossary={glossary} />
    ),
  },
  {
    index: 3,
    id: nationalDebtSectionIds[3],
    title: "The Growing National Debt",
    component: (glossary, cpiDataByYear) => (
      <GrowingNationalDebtSection
        sectionId={nationalDebtSectionIds[3]}
        glossary={glossary}
        cpiDataByYear={cpiDataByYear}
      />
    ),
  },
  {
    index: 4,
    id: nationalDebtSectionIds[4],
    title: "Breaking Down the Debt",
    component: (glossary, cpiDataByYear) => (
      <BreakingDownTheDebt
        sectionId={nationalDebtSectionIds[4]}
        glossary={glossary}
      />
    ),
  },
  {
    index: 5,
    id: nationalDebtSectionIds[5],
    title: "The Debt Ceiling",
    component: (glossary, cpiDataByYear) => (
      <DebtCeilingSection glossary={glossary} />
    ),
  },
  {
    index: 6,
    id: nationalDebtSectionIds[6],
    title: "Tracking the Debt",
    component: (glossary, cpiDataByYear) => (
      <DebtTrackingSection glossary={glossary} />
    ),
  },
  {
    index: 7,
    id: nationalDebtSectionIds[7],
    title: "Dive Deeper into the Debt",
    component: (glossary, cpiDataByYear) => (
      <DiveDeeperSection glossary={glossary} />
    ),
  },
];

export default nationalDebtSections;

const debtToThePenny = (
  <CustomLink
    url={"/datasets/debt-to-the-penny/"}
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Debt to the Penny
  </CustomLink>
);

const mspd = (
  <CustomLink
    url={"/datasets/monthly-statement-public-debt/"}
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Monthly Statement of the Public Debt (MSPD)
  </CustomLink>
);

const historicalDebt = (
  <CustomLink
    url={"/datasets/historical-debt-outstanding/"}
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Historical Debt Outstanding
  </CustomLink>
);

const treasurySecurities = (
  <CustomLink
    url={"/datasets/average-interest-rates-treasury-securities/"}
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Average Interest Rates on U.S. Treasury Securities
  </CustomLink>
);

const bls = (
  <CustomLink
    url={"https://www.bls.gov/developers"}
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Bureau of Labor Statistics
  </CustomLink>
);

const bea = (
  <CustomLink
    url={
      "https://apps.bea.gov/iTable/iTable.cfm?reqid=19&step=3&isuri=1&nipa_table_list=5&" +
      "categories=survey"
    }
    onClick={() => analyticsClickHandler("Citation Click", "DS&M")}
  >
    Bureau of Economic Analysis
  </CustomLink>
);

const github = (
  <CustomLink
    url={
      "https://github.com/fedspendingtransparency/fiscal-data/tree/master/documentation"
    }
    onClick={() => analyticsClickHandler("Citation Click", "DS&M Github")}
  >
    GitHub repository
  </CustomLink>
);

export const nationalDebtDataSources = (
  <>
    Three different Fiscal Data datasets are used for federal debt values on
    this page. {debtToThePenny} provides daily values; values from the December{" "}
    {mspd} are used for visualizations showing calendar years; and{" "}
    {historicalDebt} provides an annual value for fiscal years. Interest rates
    are pulled from the {treasurySecurities} dataset. Adjustments for inflation
    are calculated using Consumer Price Index values from the {bls}. Fiscal year
    Gross Domestic Product values from the {bea} are calculated by averaging
    four relevant quarterly values from calendar year quarter 4 of the prior
    year through calendar year quarter 3 of the fiscal year shown. For detailed
    documentation, users can reference our {github}.
  </>
);

// export for use in tests
export const nationalDebtDescriptionAppendix =
  "Learn how the national debt works and how it impacts you.";

export const nationalDebtDescriptionGenerator = () => {
  const fields = "fields=tot_pub_debt_out_amt,record_date";
  const sort = "sort=-record_date";
  const pagination = "page[size]=1&page[number]=1";
  const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl = `${apiPrefix}${endpointUrl}`;
  return basicFetch(debtUrl).then(res => {
    let seoDescription = nationalDebtDescriptionAppendix;
    if (res && res.data) {
      const amount =
        "$" +
        (Number(res.data[0]["tot_pub_debt_out_amt"]) / 1000000000000).toFixed(
          2
        );
      seoDescription =
        `The federal government currently has ${amount} trillion in federal debt. ` +
        seoDescription;
    }
    return seoDescription;
  });
};
