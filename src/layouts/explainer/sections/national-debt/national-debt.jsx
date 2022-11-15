import React, { useEffect, useRef, useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { withWindowSize } from "react-fns";
import { format, getYear } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faPeopleCarry,
  faDollarSign,
  faHandHoldingMedical,
  faHeartbeat,
  faShieldAlt,
  faUserFriends,
  faSpinner,
  faFunnelDollar,
  faCoins,
  faFileInvoiceDollar,
  faFlagUsa,
  faMoneyCheckDollar,
} from "@fortawesome/free-solid-svg-icons";

import Accordion from "../../../../components/accordion/accordion";
import VisualizationCallout from "../../../../components/visualization-callout/visualization-callout";
import { visWithCallout, chartBackdrop } from "../../explainer.module.scss";
import drawChart, {
  addHoverEffects,
  removeHoverEffects,
} from "../../../../components/charts/chart-primary";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import simplifyNumber from "../../../../helpers/simplify-number/simplifyNumber";
import { apiPrefix, basicFetch } from "../../../../utils/api-utils";
import {
  datasetSectionConfig,
  getDateWithoutOffset,
} from "../../explainer-helpers/explainer-helpers";
import {
  breakpointLg,
  breakpointSm,
  fontBodyCopy,
  fontSize_10,
  fontSize_14,
  fontSize_16,
  fontSize_36,
  debtExplainerPrimary,
  debtExplainerLightSecondary,
} from "../../../../variables.module.scss";
import { pxToNumber } from "../../../../helpers/styles-helper/styles-helper";
import curvedArrow from "../../../../images/curved-arrow.svg";
import alexanderHamilton from "../../../../images/alexander-hamilton.png";
import benFranklin from "../../../../images/ben-franklin.png";

import {
  // Key Takeaways
  keyTakeawaysContent,
  icon,
  offsetIcon,
  iconBackground,
  noMarginBottom,
  // NationalDebtExplained
  nationalDebtExplainedTextContent,
  nationalDebtExplainedTable,
  tableIcon,
  borderBottom,
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
  growingNationalDebtSectionGraphContainer,
  growingNationalDebtSectionGraph,
  growingNationalDebtSectionAccordion,
  title,
  simple,
  headerContainer,
  header,
  subHeader,
  footerContainer,
  debtBreakdownSectionGraphContainer,
  barChartContainer,
  multichartWrapper,
  multichartContainer,
  multichartLegend,
  aveInterestLegend,
  debtLegend,
  lineChartContainer,
  postGraphContent,
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
  debtTrendsOverTimeSectionGraphContainer,
  subTitle,
  titleBreakdown,
  postGraphAccordionContainer,
} from "./national-debt.module.scss";
import { Bar } from "@nivo/bar";
import Multichart from "../../multichart/multichart";
import GlossaryTerm from "../../../../components/glossary-term/glossary-term";
import { adjustDataForInflation } from "../../../../helpers/inflation-adjust/inflation-adjust";
import Analytics from "../../../../utils/analytics/analytics";
import QuoteBox from "../../quote-box/quote-box";

export const nationalDebtSectionConfigs = datasetSectionConfig["national-debt"];

export const nationalDebtSectionIds = [
  "key-takeaways",
  "national-debt-explained",
  "funding-programs",
  "growing-national-debt",
  "breakdown",
  "debt-ceiling",
  "debt-tracking",
  "dive-deeper",
];
let gaTimerDebt100Yrs;
let gaTimerDebtTrends;
let gaTimerDualChart;
const analyticsClickHandler = (action, section) => {
  Analytics.event({
    category: "Explainers",
    action: action,
    label: `Debt - ${section}`,
  });
};

export const nationalDebtExplainedTableContent = {
  header: [
    null,
    <FontAwesomeIcon icon={faCoins} className={tableIcon} />,
    <FontAwesomeIcon icon={faFunnelDollar} className={tableIcon} />,
    <FontAwesomeIcon icon={faFileInvoiceDollar} className={tableIcon} />,
    null,
  ],
  body: [
    [null, "Revenue", "Spending", "Deficit", null],
    ["Year 1", "$400", "$500", "-$100", null],
    ["Year 2", "$600", "$800", "-$200", null],
    [null, null, null, "-$300", "Debt"],
  ],
  footer: [null, null, null, <img src={curvedArrow} alt="" />],
};

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
const alternateBarColor = "#b699c6";

const KeyTakeawaysSection = ({ glossary }) => {
  const nonMarketableSecurities = (
    <GlossaryTerm
      term="Non-Marketable Securities"
      page="Debt explainer"
      glossary={glossary}
    >
      non-marketable
    </GlossaryTerm>
  );
  const marketableSecurities = (
    <GlossaryTerm
      term="Marketable Securities"
      page="Debt explainer"
      glossary={glossary}
    >
      marketable
    </GlossaryTerm>
  );

  return (
    <>
      <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faMoneyCheckDollar} className={icon} />
          <FontAwesomeIcon icon={faMoneyCheckDollar} className={offsetIcon} />
        </div>
        <p>
          The national debt is composed of distinct types of debt, similar to an
          individual whose debt may consist of a mortgage, car loan, and credit
          cards. The different types of debt include {nonMarketableSecurities}{" "}
          or {marketableSecurities} securities and whether it is debt held by
          the public or debt held by the government itself (known as
          intragovernmental).
        </p>
      </div>
      <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faChartLine} className={icon} />
          <FontAwesomeIcon icon={faChartLine} className={offsetIcon} />
        </div>
        <p>
          The U.S. has carried debt since its inception. Debts incurred during
          the American Revolutionary War amounted to $75 million, primarily
          borrowed from domestic investors and the French Government for war
          materials.
        </p>
      </div>
      <div className={`${keyTakeawaysContent} ${noMarginBottom}`}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faPeopleCarry} className={icon} />
          <FontAwesomeIcon icon={faPeopleCarry} className={offsetIcon} />
        </div>
        <p>
          The national debt enables the federal government to pay for important
          programs and services for the American public.
        </p>
      </div>
    </>
  );
};

export const NationalDebtExplainedSection = ({ glossary }) => {
  const glossaryTerms = {
    fiscalYear: (
      <GlossaryTerm
        term="Fiscal Year"
        page="Debt explainer"
        glossary={glossary}
      >
        fiscal year (FY)
      </GlossaryTerm>
    ),
    spending: (
      <GlossaryTerm term="Spending" page="Debt explainer" glossary={glossary}>
        spending
      </GlossaryTerm>
    ),
    revenue: (
      <GlossaryTerm term="Revenue" page="Debt explainer" glossary={glossary}>
        revenue
      </GlossaryTerm>
    ),
    deficit: (
      <GlossaryTerm term="Deficit" page="Debt explainer" glossary={glossary}>
        deficit
      </GlossaryTerm>
    ),
    bonds: (
      <GlossaryTerm term="Bonds" page="Debt explainer" glossary={glossary}>
        bonds
      </GlossaryTerm>
    ),
    bills: (
      <GlossaryTerm term="Bills" page="Debt explainer" glossary={glossary}>
        bills
      </GlossaryTerm>
    ),
    notes: (
      <GlossaryTerm term="Notes" page="Debt explainer" glossary={glossary}>
        notes
      </GlossaryTerm>
    ),
    floatingRateNotes: (
      <GlossaryTerm
        term="Floating Rate Notes"
        page="Debt explainer"
        glossary={glossary}
      >
        floating rate notes
      </GlossaryTerm>
    ),
    tips: (
      <GlossaryTerm
        term="Treasury Inflation Protected Securities (TIPS)"
        page="Debt explainer"
        glossary={glossary}
      >
        Treasury inflation-protected securities (TIPS)
      </GlossaryTerm>
    ),
  };

  return (
    <>
      <div className={visWithCallout}>
        <div className={nationalDebtExplainedTextContent}>
          <p>
            The national debt is the amount of money the federal government has
            borrowed to cover the outstanding balance of expenses incurred over
            time. In a given {glossaryTerms.fiscalYear}, when{" "}
            {glossaryTerms.spending} (ex. money for roadways) exceeds{" "}
            {glossaryTerms.revenue} (ex. money from federal income tax), a
            budget {glossaryTerms.deficit} results. To pay for this deficit, the
            federal government borrows money by selling marketable securities
            such as Treasury {glossaryTerms.bonds}, {glossaryTerms.bills},{" "}
            {glossaryTerms.notes}, {glossaryTerms.floatingRateNotes}, and{" "}
            {glossaryTerms.tips}. The national debt is the accumulation of this
            borrowing along with associated interest owed to the investors who
            purchased these securities. As the federal government experiences
            reoccurring deficits, which is common, the national debt grows.
          </p>
          <p>
            Simply put, the national debt is similar to a person using a credit
            card for purchases and not paying off the full balance each month.
            The cost of purchases exceeding the amount paid off represents a
            deficit, while accumulated deficits over time represents a person’s
            overall debt.
          </p>
        </div>
        <VisualizationCallout color={debtExplainerPrimary}>
          <p>
            The U.S. Treasury uses the terms “national debt,” “federal debt,”
            and “public debt” interchangeably.
          </p>
        </VisualizationCallout>
      </div>
      <div
        className={nationalDebtExplainedTable}
        role="img"
        aria-label="Image displays fictional data to show the connection of revenue, spending, deficit, and debt for two years."
      >
        <table>
          <thead>
            <tr>
              {nationalDebtExplainedTableContent.header.map((th, i) => (
                <th key={i}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nationalDebtExplainedTableContent.body.map((tb, i) => (
              <tr key={i}>
                {tb.map((t, j) => {
                  // second-to-last element in second-to-last row before footer
                  const borderBottomEl =
                    i === nationalDebtExplainedTableContent.body.length - 2 &&
                    j === tb.length - 2;

                  // last element in last row before footer
                  const boldEl =
                    i === 0 ||
                    (i === nationalDebtExplainedTableContent.body.length - 1 &&
                      j === tb.length - 1);

                  return (
                    <td className={borderBottomEl ? borderBottom : ""} key={j}>
                      {boldEl ? <strong>{t}</strong> : t}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              {nationalDebtExplainedTableContent.footer.map((tf, i) => (
                <td colSpan={tf !== null ? 2 : 1} key={i}>
                  {tf}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

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

  return (
    <>
      <p>
        The federal government needs to borrow money to pay its bills when its
        ongoing spending activities and investments cannot be funded by federal
        revenues alone. Decreases in federal revenue are largely due to either a
        decrease in tax rates or individuals or corporations making less money.
        The national debt enables the federal government to pay for important
        programs and services even if it does not have funds immediately
        available, often due to a decrease in revenue. Decreases in federal
        revenue coupled with increased government spending further increases the
        deficit.
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
    const chartId = `${sectionId}-chart`;
    const chartOptions = {
      forceHeight: width < pxToNumber(breakpointLg) ? 200 : 400,
      forceLabelFontSize:
        width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      format: true,
      yAxisTickNumber: 5,
      showOuterXAxisTicks: true,
      placeInitialMarker: true,
      noTooltip: true,
      noShaders: true,
      noInnerXAxisTicks: true,
      shading: {
        side: "under",
        color: chartPatternBackground,
      },
    };

    const [data, setData] = useState({});
    const [date, setDate] = useState("");
    const [value, setValue] = useState(0);
    const [year, setYear] = useState("");
    const [startYear, setStartYear] = useState("");
    const [startValue, setStartValue] = useState("");
    const [tempDate, setTempDate] = useState(null);
    const [tempValue, setTempValue] = useState(0);
    const [labels, setLabels] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [lineChartHoveredYear, setLinechartHoveredYear] = useState("");
    const [lineChartHoveredValue, setLinechartHoveredValue] = useState("");


  const chartRef = useRef();

    const {
      name,
      slug,
      dateField,
      valueField,
      endpoint,
    } = nationalDebtSectionConfigs[sectionId];

    const historicalDebtOutstanding_Last100Years = (
      <CustomLink
        url={slug}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "U.S. Federal Debt Trends Over the Last 100 Years"
          )
        }
      >
        {name}
      </CustomLink>
    );

    const historicalDebtOutstanding_DebtTrends = (
      <CustomLink
        url={slug}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "Federal Debt Trends Over Time"
          )
        }
      >
        {name}
      </CustomLink>
    );

    const beaLink = (
      <CustomLink
        url={"https://www.bea.gov/"}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "Federal Debt Trends Over Time"
          )
        }
      >
        Bureau of Economic Analysis
      </CustomLink>
    );

    const blsLink = (
      <CustomLink
        url={"https://www.bls.gov/"}
        onClick={() =>
          analyticsClickHandler(
            "Citation Click",
            "U.S. Federal Debt Trends Over the Last 100 Years"
          )
        }
      >
        Bureau of Labor Statistics
      </CustomLink>
    );

    const gdp = (
      <GlossaryTerm
        term="Gross Domestic Product (GDP)"
        page="Debt explainer"
        glossary={glossary}
      >
        gross domestic product (GDP)
      </GlossaryTerm>
    );

  const handleChange = (newDate, newValue) => {
    setTempDate(newDate);
    setTempValue(newValue);
  }

  const handleMouseEnter = (event) => {
    if (event.target['id'] === chartId) {
      addHoverEffects(
        data,
        chartId,
        dateField,
        [valueField],
        handleChange,
      );
      gaTimerDebt100Yrs = setTimeout(() =>{
        Analytics.event({
          category: 'Explainers',
          action: 'Chart Hover',
          label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years'
        });
      }, 3000);
    }
  };

    const handleMouseLeave = () => {
      clearTimeout(gaTimerDebt100Yrs);
    setTimeout(() => {
      removeHoverEffects();
      setTempDate(null);
      setTempValue(0);
      }, 500);

  };

    useEffect(() => {
      basicFetch(`${apiPrefix}${endpoint}`)
        .then(dataset => {
          dataset.data = adjustDataForInflation(
            dataset.data,
            valueField,
            dateField,
            cpiDataByYear
          );
          const latestEntry = dataset.data[0];
          const earliestEntry = dataset.data[dataset.data.length - 1];
          // Use window.innerWidth instead of width prop because this doesn't trigger on mount
          chartOptions.forceHeight =
            window.innerWidth < pxToNumber(breakpointLg) ? 200 : 400;
          chartOptions.forceLabelFontSize =
            window.innerWidth < pxToNumber(breakpointLg)
              ? fontSize_10
              : fontSize_14;

          const xAxisTickValues = [];
          const step = Math.floor(dataset.data.length / 5);
          for (let i = 0, il = dataset.data.length; i < il; i += step) {
            const tickValue = new Date(dataset.data[i][dateField]);
            xAxisTickValues.push(tickValue);
          }
          chartOptions.xAxisTickValues = xAxisTickValues;

          setData(dataset.data);
          setDate(latestEntry[dateField]);
          setValue(latestEntry[valueField]);
          setYear(latestEntry.record_fiscal_year);
          setStartYear(earliestEntry.record_fiscal_year);
          setStartValue(earliestEntry[valueField]);
          setLabels(dataset.meta.labels);
          setIsLoading(false);

          drawChart(
            dataset.data,
            chartRef.current,
            dateField,
            [valueField],
            dataset.meta.labels,
            chartOptions
          );
        })
        .catch(err => {
          console.error(err);
        });
    }, []);

    useEffect(() => {
      chartOptions.forceHeight = width < pxToNumber(breakpointLg) ? 200 : 400;
      const xAxisTickValues = [];
      const step = Math.floor(data.length / 5);
      for (let i = 0, il = data.length; i < il; i += step) {
        const tickValue = new Date(data[i][dateField]);
        xAxisTickValues.push(tickValue);
      }
      chartOptions.xAxisTickValues = xAxisTickValues;

      if (document.getElementById(chartId)) {
        drawChart(
          data,
          chartRef.current,
          dateField,
          [valueField],
          labels,
          chartOptions
        );
      }
    }, [width]);

    // Account for time zone offset since there is no time stamp in the date field
    const dateWithoutOffset = getDateWithoutOffset(date);

    const displayDate = tempDate
      ? getYear(new Date(tempDate))
      : getYear(dateWithoutOffset);
    const displayValue = tempDate
      ? simplifyNumber(tempValue, true)
      : simplifyNumber(value, true);

    // Below are the configs for custom properties for the debt trends over time line chart

    const [debtTrendsData, setDebtTrendsData] = useState([]);
    const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
    const [lastDebtValue, setLastDebtValue] = useState({});

    const debtEndpointUrl =
      "v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948";

    useEffect(() => {
      basicFetch(`${apiPrefix}${debtEndpointUrl}`).then(res => {
        if (res.data) {
          const debtData = res.data;
          basicFetch(
            `https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`
          ).then(res => {
            if (res.BEAAPI.Results.Data) {
              const gdpData = res.BEAAPI.Results.Data.filter(
                entry => entry.LineDescription === "Gross domestic product"
              );
              const averagedGDPByYear = [];
              for (
                let i = parseInt(
                  debtData[debtData.length - 1].record_fiscal_year
                );
                i <= parseInt(debtData[0].record_fiscal_year);
                i++
              ) {
                let allQuartersForGivenYear;
                if (i <= 1976) {
                  allQuartersForGivenYear = gdpData.filter(
                    entry =>
                      entry.TimePeriod.includes(i.toString() + "Q1") ||
                      entry.TimePeriod.includes(i.toString() + "Q2") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q3") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q4")
                  );
                } else if (i >= 1977) {
                  allQuartersForGivenYear = gdpData.filter(
                    entry =>
                      entry.TimePeriod.includes(i.toString() + "Q1") ||
                      entry.TimePeriod.includes(i.toString() + "Q2") ||
                      entry.TimePeriod.includes(i.toString() + "Q3") ||
                      entry.TimePeriod.includes((i - 1).toString() + "Q4")
                  );
                }
                if (
                  i >= 1977 &&
                  allQuartersForGivenYear.find(entry =>
                    entry.TimePeriod.includes(i.toString() + "Q3")
                  )
                ) {
                  let totalGDP = 0;
                  allQuartersForGivenYear.forEach(quarter => {
                    totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ""));
                  });
                  averagedGDPByYear.push({
                    // Correct BEA data to display in trillions
                    average: parseInt(String(totalGDP) + "000000") / 4,
                    year: i,
                  });
                } else if (i <= 1976) {
                  let totalGDP = 0;
                  allQuartersForGivenYear.forEach(quarter => {
                    totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ""));
                  });
                  averagedGDPByYear.push({
                    // Correct BEA data to display in trillions
                    average: parseInt(String(totalGDP) + "000000") / 4,
                    year: i,
                  });
                }
              }
              const debtToGDP = [];
              averagedGDPByYear.forEach(GDPEntry => {
                const record = debtData.find(entry =>
                  entry.record_date.includes(GDPEntry.year)
                );
                debtToGDP.push({
                  x: GDPEntry.year,
                  y: Math.round(
                    (parseFloat(record.debt_outstanding_amt) /
                      GDPEntry.average) *
                      100
                  ),
                });
              });
              const finalData = [
                {
                  id: "us",
                  color: "hsl(219, 70%, 50%)",
                  data: debtToGDP,
                },
              ];
              setDebtTrendsData(finalData);
              setLastDebtValue(finalData[0].data[finalData[0].data.length - 1]);
              setIsLoadingDebtTrends(false);
            }
          });
        }
      });
    }, []);

    const chartBorderTheme = {
      fontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      textColor: "#666666",
      axis: {
        domain: {
          line: {
            stroke: "#666666",
            strokeWidth: 1,
          },
        },
      },
    };

    const formatPercentage = v => `${v}%`;

    const CustomSlices = ({ slices, setCurrentSlice }) => {
      return (
        <g>
          {slices.map(slice => (
            <rect
              x={slice.x0}
              y={slice.y0}
              tabIndex={0}
              width={slice.width + 1}
              height={slice.height}
              strokeWidth={1}
              strokeOpacity={0}
              fillOpacity={0}
              onMouseEnter={() => setCurrentSlice(slice)}
              onMouseLeave={() => {
                setCurrentSlice(null);
              }}
            />
          ))}
        </g>
      );
    };

    const CustomPoint = props => {
      const { currentSlice, borderWidth, borderColor, points } = props;

      if (!isLoadingDebtTrends) {
        const currentPoint = currentSlice?.points?.length
          ? currentSlice.points[0]
          : points[points.length - 1];
        setLinechartHoveredValue(formatPercentage(currentPoint.data.y));
        setLinechartHoveredYear(currentPoint.data.x);
        return (
          <g>
            <circle
              fill={"#D8D8D8"}
              r={8}
              strokeWidth={borderWidth}
              stroke={borderColor}
              fillOpacity={0.35}
              cx={currentPoint.x}
              cy={currentPoint.y}
            />
            <circle
              r={2}
              strokeWidth={"4"}
              stroke={"#000000"}
              fill={"#000000"}
              fillOpacity={0.85}
              cx={currentPoint.x}
              cy={currentPoint.y}
            />
          </g>
        );
      }
    };

const handleMouseEnterLineChart = () => {
  gaTimerDebtTrends = setTimeout(() =>{
    Analytics.event({
      category: 'Explainers',
      action: 'Chart Hover',
      label: 'Debt - Federal Debt Trends Over Time'
    });
  }, 3000);
}
  const handleMouseLeaveLineChart = () => {
    clearTimeout(gaTimerDebtTrends);
  };

    const lineChartOnMouseLeave = () => {
      setLinechartHoveredValue(formatPercentage(lastDebtValue.y));
      setLinechartHoveredYear(lastDebtValue.x);
    };

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
          pandemic. From FY 2019 to FY 2021, spending increased by about 50%,
          largely due to the COVID-19 pandemic. Tax cuts, stimulus programs,
          increased government spending, and decreased tax revenue caused by
          widespread unemployment generally account for sharp rises in the
          national debt.
        </p>
        {!isLoading ? (
          <div className={visWithCallout}>
            <div>
              <div
                className={`${growingNationalDebtSectionGraphContainer} ${chartBackdrop}`}
                role={"img"}
                aria-label={`Line graph displaying the amount of debt in trillions from ${startYear} to ${year}.
              The graph shows a steady trend with an increase beginning around 1940 continuing through today.`}
              >
                <p className={title}>
                  U.S. National Debt Over the Last 100 Years
                </p>
                <p className={subTitle}>
                  {" "}
                  (Inflation Adjusted - {year} Dollars){" "}
                </p>
                <div className={headerContainer}>
                  <div>
                    <div className={header}>{displayDate}</div>
                    <span className={subHeader}>Fiscal Year</span>
                  </div>
                  <div>
                    <div className={header}>{displayValue}</div>
                    <span className={subHeader}>Total Debt</span>
                  </div>
                </div>
                <div
                  id={`${sectionId}-chart`}
                  className={growingNationalDebtSectionGraph}
                  ref={chartRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  data-testid="chart"
                >
                  {isLoading && (
                    <div>
                      <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
                    </div>
                  )}
                </div>
                <div className={footerContainer}>
                  <p>
                    Visit the {historicalDebtOutstanding_Last100Years} dataset
                    to explore and download this data. The inflation data is
                    sourced from the {blsLink}.
                  </p>
                  <p>
                    Last Updated: {format(dateWithoutOffset, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                Over the past 100 years, the U.S. federal debt has increased
                from {simplifyNumber(startValue, true)} in {startYear} to{" "}
                {simplifyNumber(value, true)} in {year}.
              </p>
            </VisualizationCallout>
          </div>
        ) : (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
          </div>
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
        <div className={visWithCallout}>
          {isLoadingDebtTrends && (
            <div>
              <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
            </div>
          )}
          {!isLoadingDebtTrends && (
            <>
              <div>
                <div className={debtTrendsOverTimeSectionGraphContainer}>
                  <p className={title}>
                    {" "}
                    Federal Debt Trends Over Time, FY 1948 – {lastDebtValue.x}
                  </p>
                  <p className={subTitle}>
                    {" "}
                    Debt to Gross Domestic Product (GDP){" "}
                  </p>
                  <div className={headerContainer}>
                    <div>
                      <div className={header}>
                        {lineChartHoveredYear === ""
                          ? lastDebtValue.x
                          : lineChartHoveredYear}
                      </div>
                      <span className={subHeader}>Fiscal Year</span>
                    </div>
                    <div>
                      <div className={header}>
                        {lineChartHoveredValue === ""
                          ? lastDebtValue.y + "%"
                          : lineChartHoveredValue}
                      </div>
                      <span className={subHeader}>Debt to GDP</span>
                    </div>
                  </div>
                  <div
                    className={`${lineChartContainer} ${chartBackdrop}`}
                    data-testid={"debtTrendsChart"}
                    onMouseEnter={handleMouseEnterLineChart}
                  onMouseLeave={handleMouseLeaveLineChart}
                  role={"img"}
                  aria-label={`Line graph displaying the federal debt to GDP trend over time
                  from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`}
                  >
                    <ResponsiveLine
                      data={debtTrendsData}
                      theme={chartBorderTheme}
                      layers={[
                        "grid",
                        "lines",
                        "axes",
                        CustomPoint,
                        CustomSlices,
                      ]}
                      margin={
                        width < pxToNumber(breakpointLg)
                          ? { top: 8, right: 25, bottom: 30, left: 35 }
                          : { top: 8, right: 25, bottom: 30, left: 50 }
                      }
                      xScale={{
                        type: "linear",
                        min: 1940,
                        max: 2030,
                      }}
                      yScale={{
                        type: "linear",
                        min: 0,
                        max: 140,
                        stacked: true,
                        reverse: false,
                      }}
                      yFormat=" >-.2f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        orient: "bottom",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        tickValues: 9,
                      }}
                      axisLeft={{
                        format: formatPercentage,
                        orient: "left",
                        tickSize: 5,
                        tickValues: 8,
                      }}
                      enablePoints={false}
                      enableSlices={"x"}
                      pointSize={0}
                      pointColor={debtExplainerPrimary}
                      pointBorderWidth={2}
                      pointBorderColor={debtExplainerPrimary}
                      pointLabelYOffset={-12}
                      colors={debtExplainerPrimary}
                      useMesh={false}
                      enableGridY={false}
                      enableGridX={false}
                      sliceTooltip={() => <></>}
                      enableCrosshair={false}
                      animate={true}
                      isInteractive={true}
                      onMouseLeave={lineChartOnMouseLeave}
                    />
                  </div>
                  <div className={footerContainer}>
                    <p>
                      {" "}
                      Visit the {historicalDebtOutstanding_DebtTrends} dataset
                      to explore and download this data. The GDP data is sourced
                      from the {beaLink}.
                    </p>
                    <p>Last Updated: September 30, {lastDebtValue.x}</p>
                  </div>
                </div>
              </div>
              <VisualizationCallout color={debtExplainerPrimary}>
                <p>
                  When adjusted for inflation, the U.S. federal debt has
                  steadily increased since 2001. Without adjusting for
                  inflation, the U.S. federal debt has steadily increased since
                  1957. Another way to view the federal debt over time is to
                  look at the ratio of federal debt related to GDP. This ratio
                  has generally increased since 1981.
                </p>
              </VisualizationCallout>
            </>
          )}
        </div>
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

export const DebtBreakdownSection = withWindowSize(
  ({ sectionId, glossary, width }) => {
    const [data, setData] = useState();
    const [date, setDate] = useState(new Date());
    const [isChartRendered, setIsChartRendered] = useState(false);
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [multichartConfigs, setMultichartConfigs] = useState([]);
    const [multichartDataLoaded, setMultichartDataLoaded] = useState(false);
    const [debtValue, setDebtValue] = useState("0");
    const [interestValue, setInterestValue] = useState("0");
    const [focalYear, setFocalYear] = useState(1900);
    const [multichartStartYear, setMultichartStartYear] = useState("");
    const [multichartEndYear, setMultichartEndYear] = useState("");
    const [multichartInterestRateMax, setMultichartInterestRateMax] = useState(
      "0"
    );
    const [multichartInterestRateMin, setMultichartInterestRateMin] = useState(
      "0"
    );
    const [interestExpenseEndMonth, setInterestExpenseEndMonth] = useState("");
    const [interestExpenseEndYear, setInterestExpenseEndYear] = useState("");
    const [shortenedDebtExpense, setShortenedDebtExpense] = useState("0");
    const [debtExpensePercent, setDebtExpensePercent] = useState("0%");

    const glossaryTerms = {
      debtHeldByThePublic: (
        <GlossaryTerm
          term="Debt Held by the Public"
          page="Debt explainer"
          glossary={glossary}
        >
          debt held by the public
        </GlossaryTerm>
      ),
      intragovernmental: (
        <GlossaryTerm
          term="Intragovernmental Holdings"
          page="Debt explainer"
          glossary={glossary}
        >
          intragovernmental
        </GlossaryTerm>
      ),
      calendarYear: (
        <GlossaryTerm
          term="Calendar Year"
          page="Debt explainer"
          glossary={glossary}
        >
          calendar year
        </GlossaryTerm>
      ),
      interestRates: (
        <GlossaryTerm
          term="Interest Rates"
          page="Debt explainer"
          glossary={glossary}
        >
          interest rates
        </GlossaryTerm>
      ),
    };

    const {
      name,
      slug,
      endpoint,
      getQueryString,
      transformer,
      multichart,
    } = nationalDebtSectionConfigs[sectionId];

    const fiveTheme = {
      fontSize: fontSize_16,
      textColor: fontBodyCopy,
      markers: {
        lineStrokeWidth: 0,
      },
      grid: {
        line: {
          stroke: fontBodyCopy,
          strokeWidth: 2,
        },
      },
      legends: {
        text: {
          fontSize: fontSize_16,
        },
      },
    };

    const layers = [
      "grid",
      "axes",
      "bars",
      "markers",
      "legends",
      "annotations",
    ];

    const sideMarkerPos = {
      axis: "y",
      legendOffsetY: -22,
    };
    const markerText = {
      fontSize: fontSize_36,
      fill: fontBodyCopy,
      fontWeight: "bold",
    };
    const sideMarkerLeft = {
      ...sideMarkerPos,
      legendOffsetX: 228,
      textStyle: markerText,
    };
    const sideMarkerRight = {
      ...sideMarkerPos,
      legendOffsetX: 8,
      textStyle: {
        ...markerText,
        textAnchor: "start",
      },
    };

    const calcPercentIncrease = (key, rows) =>
      Math.round(
        ((rows[1][key] - rows[0][key]) / rows[0][key]) * 100
      ).toFixed();

    const applyChartScaling = () => {
      // rewrite some element attribs after render to ensure Chart scales with container
      // which doesn't seem to happen naturally when nivo has a flex container
      const svgChart = document.querySelector(
        '[data-testid="breakdownChart"] svg'
      );
      if (svgChart) {
        svgChart.setAttribute("viewBox", "0 0 524 500");
        svgChart.setAttribute("height", "100%");
        svgChart.setAttribute("width", "100%");
      }
    };

    // generate rectangular color swatches in footer legend
    const CustomSymbolShape = ({
      x,
      y,
      size,
      fill,
      borderWidth,
      borderColor,
    }) => {
      return (
        <rect
          x={x}
          y={y}
          fill={fill}
          strokeWidth={borderWidth}
          stroke={borderColor}
          width={size * 2}
          height={size}
          style={{ pointerEvents: "none" }}
        />
      );
    };

    const chartOptions = {
      forceHeight: 400,
      forceYAxisWidth: 60,
      maxHeightToWidthRatio: 0.8,
      forceLabelFontSize:
        width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
      format: true,
      showOuterXAxisTicks: true,
      placeInitialMarker: true,
      noTooltip: true,
      noShaders: true,
      noInnerXAxisTicks: false,
      placeInnerXAxisTicksBelowLine: true,
      excludeYAxis: true,
      marginLabelOptions: {
        fontSize: 14,
        fontColor: "#666666",
        fontWeight: 600,
      },
    };

    const interestChartOptions = Object.assign(
      { inverted: false },
      chartOptions
    );
    const amountChartOptions = Object.assign(
      {
        inverted: true,
        shading: {
          side: "under",
          color: chartPatternBackground,
        },
      },
      chartOptions
    );

    const localMultichartConfigs = [
      {
        name: "interest",
        dataSourceUrl: `${apiPrefix}${multichart.endpoints[0].path}`,
        dateField: multichart.endpoints[0].dateField,
        fields: [multichart.endpoints[0].valueField],
        options: interestChartOptions,
        marginLabelFormatter: percentageFormatter,
        marginLabelLeft: true,
        marginLabelRight: true,
        zeroMarginLabelLeft: true,
      },
      {
        name: "debt",
        dataSourceUrl: `${apiPrefix}${multichart.endpoints[1].path}`,
        dateField: multichart.endpoints[1].dateField,
        fields: [multichart.endpoints[1].valueField],
        options: amountChartOptions,
        marginLabelFormatter: trillionsFormatter,
        marginLabelLeft: true,
        marginLabelRight: true,
      },
    ];

    const hoverEffectHandler = recordDate => {
      const year =
        recordDate === null
          ? multichartConfigs[0].data[0][
              multichartConfigs[0].dateField
            ].substring(0, 4)
          : recordDate.substring(0, 4);
      if (multichartConfigs[0].data && multichartConfigs[1].data) {
        const interestRow = multichartConfigs[0].data.find(
          row => row[multichartConfigs[0].dateField].indexOf(year) === 0
        );
        const interest = percentageFormatter(
          interestRow[multichartConfigs[0].fields[0]]
        );

        const debtRow = multichartConfigs[1].data.find(
          row => row[multichartConfigs[1].dateField].indexOf(year) === 0
        );
        const debt = trillionsFormatter(
          debtRow[multichartConfigs[1].fields[0]]
        );
        setInterestValue(interest);
        setDebtValue(debt);
        setFocalYear(year);
      }
    };

    useEffect(() => {
      if (isChartRendered) {
        applyChartScaling();

        const fetchers = [];
        localMultichartConfigs.forEach(chartConfig => {
          fetchers.push(
            basicFetch(chartConfig.dataSourceUrl)
              .then(response => {
                const xAxisTickValues = [];
                for (let i = 0, il = response.data.length; i < il; i += 1) {
                  const tickValue = new Date(
                    response.data[i][chartConfig.dateField]
                  );
                  xAxisTickValues.push(tickValue);
                }
                chartConfig.options.xAxisTickValues = xAxisTickValues;
                chartConfig.data = response.data;
              })
              .catch(err => {
                console.error(err);
              })
          );
        });

        Promise.all(fetchers).then(() => {
          const dataPopulatedConfigs = [];
          let sortedInterestRates = [];
          localMultichartConfigs.forEach(config => {
            dataPopulatedConfigs.push(Object.assign({}, config));
          });
          setMultichartConfigs(dataPopulatedConfigs);
          setMultichartStartYear(
            dataPopulatedConfigs[0].data[
              dataPopulatedConfigs[0].data.length - 1
            ].record_calendar_year
          );
          setMultichartEndYear(
            dataPopulatedConfigs[0].data[0].record_calendar_year
          );
          sortedInterestRates = [...dataPopulatedConfigs[0].data].sort(
            (a, b) => {
              return a.avg_interest_rate_amt - b.avg_interest_rate_amt;
            }
          );
          setMultichartInterestRateMin(
            percentageFormatter(sortedInterestRates[0].avg_interest_rate_amt)
          );
          setMultichartInterestRateMax(
            percentageFormatter(
              sortedInterestRates[sortedInterestRates.length - 1]
                .avg_interest_rate_amt
            )
          );
        });
      }
    }, [isChartRendered]);

    useEffect(() => {
      if (multichartConfigs && multichartConfigs.length > 1) {
        if (
          multichartConfigs.every(config => config.data && config.data.length)
        ) {
          setMultichartDataLoaded(true);
        }
      }
    }, [multichartConfigs]);

    useEffect(() => {
      if (multichartDataLoaded) {
        hoverEffectHandler(
          multichartConfigs[0].data[0][multichartConfigs[0].dateField]
        );
      }
    }, [multichartDataLoaded]);

    const multichartId = "interestToDebt";

    useEffect(() => {
      basicFetch(`${apiPrefix}${endpoint}${getQueryString()}`).then(
        response => {
          const transformed = transformer(response);
          if (transformed && transformed.length === 2) {
            setData(transformed);
            setDate(getDateWithoutOffset(transformed[1].record_date));
            setStartYear(transformed[0].record_calendar_year);
            setEndYear(transformed[1].record_calendar_year);
          }
        }
      );
    }, []);

    useEffect(() => {
      basicFetch(`${apiPrefix}v1/accounting/mts/mts_table_5?fields=
        current_fytd_net_outly_amt,prior_fytd_net_outly_amt,
        record_date,record_calendar_month,record_calendar_year,record_fiscal_year
        &filter=line_code_nbr:eq:5691&sort=-record_date&page%5bsize%5d=1`).then(
        response => {
          if (response && response.data && response.data.length) {
            const fytdNet = response.data[0].current_fytd_net_outly_amt;
            basicFetch(
              `${apiPrefix}v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:4177&sort=-record_date&page[size]=1`
            ).then(response => {
              if (response && response.data && response.data.length) {
                setInterestExpenseEndYear(
                  response.data[0].record_calendar_year
                );
                const date = new Date();
                date.setMonth(response.data[0].record_calendar_month - 1);
                setInterestExpenseEndMonth(
                  date.toLocaleString("en-US", {
                    month: "long",
                  })
                );
                const maintainDebtExpense = parseFloat(
                  response.data[0].current_fytd_net_outly_amt
                );
                const percent = (
                  (maintainDebtExpense / parseFloat(fytdNet)) *
                  100
                ).toFixed(2);
                setDebtExpensePercent(`${parseFloat(percent).toFixed()}%`);
                setShortenedDebtExpense(
                  (maintainDebtExpense / 1000000000).toFixed().toString()
                );
              }
            });
          }
        }
      );
    }, []);


  const handleMouseEnterInterestChart = () => {
    gaTimerDualChart = setTimeout(() =>{
      Analytics.event({
        category: 'Explainers',
        action: 'Chart Hover',
        label: 'Debt - Interest Rate and Total Debt'
      });
    }, 3000);
  }
  const handleMouseLeaveInterestChart = () => {
    clearTimeout(gaTimerDualChart);
  };


  return (
    <>
      <p>
        The national debt is composed of distinct types of debt, similar to an individual whose debt consists of a mortgage,
        car loan, and credit cards. The national debt can be broken down by whether it is non-marketable or marketable and
        whether it is {" "}
          {glossaryTerms.debtHeldByThePublic} or debt held by the government
          itself (known as {glossaryTerms.intragovernmental}). The national debt
          does not include debts carried by state and local governments, such as
          debt used to pay state-funded programs; nor does it include debts
          carried by individuals, such as personal credit card debt or
          mortgages.
        </p>
        <p>
          The visual below comparing {glossaryTerms.calendarYear} {startYear}{" "}
          and {endYear} displays the difference in growth between debt held by
          the public and intragovernmental debt. While both types of debt
          combine to make up the national debt, they have increased by different
          amounts in the past several years. One of the main causes of the jump
          in public debt can be attributed to increased funding of programs and
          services during the COVID-19 pandemic. Intragovernmental debt has not
          increased by quite as much since it is primarily composed of debt owed
          on agencies’ excess revenue invested with the Treasury. The revenue of
          the largest investor in Treasury securities, the Social Security
          Administration, has not increased significantly in recent years,
          resulting in this slower intragovernmental holding increase.
        </p>
        <div className={visWithCallout}>
          {!data && (
            <div>
              <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
            </div>
          )}
          {data && (
            <>
              <div>
                <div
                  className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}
                  role={"img"}
                  aria-label={
                    "Bar chart showing Intergovernmental Holdings and Debt Held by the Public values; " +
                    "comparing the latest complete calendar year values to 10 years prior."
                  }
                >
                  <p className={titleBreakdown}>
                    Intragovernmental Holdings and Debt Held by the Public, CY{" "}
                    {data[0].record_calendar_year} and CY{" "}
                    {data[1].record_calendar_year}
                  </p>
                  <div
                    data-testid="breakdownChart"
                    className={barChartContainer}
                  >
                    <Bar
                      width={524}
                      height={468}
                      data={data}
                      keys={[
                        "Intragovernmental Holdings",
                        "Debt Held by the Public",
                      ]}
                      indexBy="record_calendar_year"
                      margin={{ top: 30, right: 144, bottom: 50, left: 144 }}
                      padding={0.24}
                      valueScale={{ type: "linear" }}
                      indexScale={{ type: "band", round: true }}
                      colors={[alternateBarColor, chartPatternBackground]}
                      isInteractive={false}
                      borderColor={fontBodyCopy}
                      axisTop={null}
                      axisRight={null}
                      axisLeft={null}
                      axisBottom={{
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                      }}
                      enableGridY={true}
                      gridYValues={[0]}
                      markers={[
                        {
                          ...sideMarkerLeft,
                          value: data[0]["Intragovernmental Holdings"],
                          legend: `$${data[0][
                            "Intragovernmental Holdings"
                          ].toFixed(2)} T`,
                        },
                        {
                          ...sideMarkerLeft,
                          value: data[0].total,
                          legend: `$${data[0][
                            "Debt Held by the Public"
                          ].toFixed(2)} T`,
                        },
                        {
                          ...sideMarkerRight,
                          value: data[1]["Intragovernmental Holdings"],
                          legend: `$${data[1][
                            "Intragovernmental Holdings"
                          ].toFixed(2)} T`,
                        },
                        {
                          ...sideMarkerRight,
                          value: data[1].total,
                          legend: `$${data[1][
                            "Debt Held by the Public"
                          ].toFixed(2)} T`,
                        },
                      ]}
                      enableLabel={false}
                      labelSkipWidth={12}
                      labelSkipHeight={12}
                      labelTextColor={fontBodyCopy}
                      legends={[
                        {
                          dataFrom: "keys",
                          anchor: "bottom-left",
                          direction: "row",
                          justify: false,
                          translateX: -125,
                          translateY: 90,
                          itemsSpacing: 15,
                          itemWidth: 250,
                          itemHeight: 40,
                          itemDirection: "left-to-right",
                          itemOpacity: 1,
                          symbolSize: 20,
                          symbolShape: CustomSymbolShape,
                          symbolSpacing: 28,
                        },
                      ]}
                      layers={[
                        ...layers,
                        () => {
                          // this final empty layer fn is called only after everything else is
                          // rendered, so it serves as a handy postRender hook.
                          // It's wrapped in a setTimout to avoid triggering a browser warning
                          setTimeout(() => setIsChartRendered(true));
                          return <></>;
                        },
                      ]}
                      ariaLabel="Chart of Debt Breakdown"
                      theme={fiveTheme}
                    />
                  </div>
                  <div className={footerContainer}>
                    Visit the{" "}
                    <CustomLink
                      url={slug}
                      onClick={() =>
                        analyticsClickHandler(
                          "Citation Click",
                          "Intragovernmental Holdings and Debt Held by the Public"
                        )
                      }
                    >
                      {name}
                    </CustomLink>{" "}
                    to explore and download this data.
                    <p>Last Updated: {format(date, "MMMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
              <VisualizationCallout color={debtExplainerPrimary}>
                <p>
                  There are two major categories for federal debt: debt held by
                  the public and intragovernmental holdings.
                </p>

                <p>
                  The debt held by the public has increased by{" "}
                  <span data-testid={"public-debt-increase"}>
                    {calcPercentIncrease("Debt Held by the Public", data)}%
                  </span>{" "}
                  since {data[0].record_calendar_year}. Intragovernmental
                  holdings increased by{" "}
                  <span data-testid={"govt-debt-increase"}>
                    {calcPercentIncrease("Intragovernmental Holdings", data)}%
                  </span>{" "}
                  since {data[0].record_calendar_year}.
                </p>
              </VisualizationCallout>
            </>
          )}
        </div>
        <div className={postGraphContent}>
          <h3>Maintaining the National Debt</h3>
          <p>
            The federal government is charged interest for the use of lenders’
            money, in the same way that lenders charge an individual interest
            for a car loan or mortgage. How much the government pays in interest
            depends on the total national debt and the various securities’{" "}
            {glossaryTerms.interestRates}.
          </p>
          <p>
            As of {interestExpenseEndMonth} {interestExpenseEndYear} it costs $
            {shortenedDebtExpense} billion to maintain the debt, which is{" "}
            {debtExpensePercent} of the total federal spending.
          </p>
          <p>
            The national debt has increased every year over the past ten years.
            Interest expenses during this period have remained fairly stable due
            to low interest rates and investors’ judgement that the U.S.
            Government has a very low risk of default. However, recent increases
            in interest rates and inflation are now resulting in an increase in
            interest expense.
          </p>
          <div className={visWithCallout}>
            {multichartDataLoaded && (
              <div className={multichartWrapper}>
                <div
                  className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}
                  role={"img"}
                  onMouseEnter={handleMouseEnterInterestChart}
                 onMouseLeave={handleMouseLeaveInterestChart}
                 aria-label={"Combined line and area chart comparing average interest rate and total debt trends over " +
                 "the last decade, ranging from " + multichartInterestRateMax + " to " + multichartInterestRateMin
                  }
                >
                  <p className={`${title} ${simple}`}>
                    Interest Rate and Total Debt, {multichartStartYear} –{" "}
                    {multichartEndYear}
                  </p>
                  <div
                    className={headerContainer}
                    data-testid="interest-and-debt-chart-header"
                  >
                    <div>
                      <div className={header}>{focalYear}</div>
                      <span className={subHeader}>Fiscal Year</span>
                    </div>
                    <div>
                      <div className={header}>{interestValue}</div>
                      <span className={subHeader}>Average Interest Rate</span>
                    </div>
                    <div>
                      <div className={header}>{debtValue}</div>
                      <span className={subHeader}>Total Debt</span>
                    </div>
                  </div>
                  <div className={multichartContainer}>
                    <Multichart
                      chartId={multichartId}
                      chartConfigs={multichartConfigs}
                      hoverEffectHandler={hoverEffectHandler}
                    />
                  </div>
                  <div
                    className={multichartLegend}
                    data-testid="interest-and-debt-chart-legend"
                  >
                    <div>
                      <div className={aveInterestLegend} />
                      <div>Average Interest Rate</div>
                    </div>
                    <div>
                      <div className={debtLegend} />
                      <div>Total Debt</div>
                    </div>
                  </div>
                  <div className={footerContainer}>
                    <p>
                      Visit the{" "}
                      <CustomLink
                        url={
                          "https://fiscaldata.treasury.gov/datasets/average-interest-rates-treasury" +
                          "-securities/average-interest-rates-on-u-s-treasury-securities"
                        }
                        onClick={() =>
                          analyticsClickHandler(
                            "Citation Click",
                            "Interest Rate and Total Debt"
                          )
                        }
                      >
                        Average Interest Rates on U.S. Treasury Securities
                      </CustomLink>{" "}
                      and{" "}
                      <CustomLink
                        url={
                          "https://fiscaldata.treasury.gov/datasets/monthly-statement-public-debt/" +
                          "summary-of-treasury-securities-outstanding"
                        }
                        onClick={() =>
                          analyticsClickHandler(
                            "Citation Click",
                            "Interest Rate and Total Debt"
                          )
                        }
                      >
                        U.S. Treasury Monthly Statement of the Public Debt
                        (MSPD)
                      </CustomLink>{" "}
                      datasets to explore and download this data.
                    </p>
                    <p>Last Updated: September 30, {multichartEndYear}</p>
                  </div>
                </div>
              </div>
            )}
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                Interest rates have fallen over the past decade. Due to lower
                interest rates, interest expenses on the debt paid by the
                federal government have remained stable even as the federal debt
                has increased.
              </p>
            </VisualizationCallout>
          </div>
          <div className={postGraphAccordionContainer}>
            <div className={debtAccordion}>
              <Accordion
                title="Why can't the government just print more money?"
                openEventNumber={"26"}
                closeEventNumber={"27"}
                explainerGAEvent="Debt"
              >
                While the Treasury prints actual dollar bills, “printing money”
                is also a term that is sometimes used to describe a means of{" "}
                <CustomLink
                  url={"https://www.federalreserve.gov/monetarypolicy.htm"}
                >
                  monetary policy
                </CustomLink>{" "}
                which is conducted by the Federal Reserve. Monetary policy
                involves controlling the supply of money and the cost of
                borrowing. The Federal Reserve uses monetary policy to promote
                maximum employment, stable prices, and moderate long-term
                interest rates on the behalf of Congress. The federal government
                uses fiscal policy, or the control of taxation and government
                spending, to promote economic activity.
              </Accordion>
            </div>
          </div>
        </div>
      </>
    );
  }
);

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
      <NationalDebtExplainedSection glossary={glossary} />
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
      <DebtBreakdownSection
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
