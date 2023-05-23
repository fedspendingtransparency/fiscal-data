import {withWindowSize} from "react-fns";
import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition";
import {pxToNumber} from "../../../../../helpers/styles-helper/styles-helper";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import Analytics from "../../../../../utils/analytics/analytics";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import VisualizationCallout
  from "../../../../../components/visualization-callout/visualization-callout";
import Multichart from "../../../multichart/multichart";
import Accordion from "../../../../../components/accordion/accordion";
import {
  chartPatternBackground,
  nationalDebtSectionConfigs
} from "../national-debt";
import { spendingLink } from '../../../explainer-helpers/national-debt-helper';
import {analyticsClickHandler} from '../../../explainer-helpers/national-debt-helper';
import React, {useEffect, useState} from "react";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
  debtExplainerPrimary,

} from "../../../../../variables.module.scss";
import {chartBackdrop, visWithCallout} from "../../../explainer.module.scss";
import {
  debtAccordion,
  postGraphAccordionContainer,
  postGraphContent,
} from "../national-debt.module.scss";
import {
  aveInterestLegend,
  debtLegend,
  debtBreakdownSectionGraphContainer,
  multichartContainer,
  multichartLegend,
  header,
  headerContainer,
  subHeader,
  title,
  simple,
  footerContainer,
  multichartWrapper,
} from './breaking-down-the-debt.module.scss';
import IntragovernmentalHoldingsChart
  from "./intragovernmental-holdings-chart/intragovernmental-holdings-chart";
import {getDateWithoutOffset} from "../../../explainer-helpers/explainer-helpers";
export const percentageFormatter = value =>
  (Math.round(Number(value) * 100).toPrecision(15) / 100).toFixed(2) + "%";
export const trillionsFormatter = value =>
  `$${(Number(value) / 1000000).toFixed(2)} T`;

let gaTimerDualChart;

const BreakingDownTheDebt = ({ sectionId, glossary, glossaryClickHandler, width }) => {
  const [data, setData] = useState();
  const [date, setDate] = useState(new Date());
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [multichartConfigs, setMultichartConfigs] = useState([]);
  const [multichartDataLoaded, setMultichartDataLoaded] = useState(false);
  const [debtValue, setDebtValue] = useState("0");
  const [interestValue, setInterestValue] = useState("0");
  const [focalYear, setFocalYear] = useState(1900);
  const [multichartStartYear, setMultichartStartYear] = useState("");
  const [multichartEndYear, setMultichartEndYear] = useState("");
  const [multichartInterestRateMax, setMultichartInterestRateMax] = useState("0");
  const [multichartInterestRateMin, setMultichartInterestRateMin] = useState("0");
  const [interestExpenseEndMonth, setInterestExpenseEndMonth] = useState("");
  const [interestExpenseEndYear, setInterestExpenseEndYear] = useState("");
  const [shortenedDebtExpense, setShortenedDebtExpense] = useState("0");
  const [debtExpensePercent, setDebtExpensePercent] = useState("0%");

  const glossaryTerms = {
    debtHeldByThePublic: (
      <GlossaryPopoverDefinition
        term="Debt Held by the Public"
        page="Debt explainer"
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      >
        debt held by the public
      </GlossaryPopoverDefinition>
    ),
    intragovernmental: (
      <GlossaryPopoverDefinition
        term="Intragovernmental Holdings"
        page="Debt explainer"
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      >
        intragovernmental
      </GlossaryPopoverDefinition>
    ),
    calendarYear: (
      <GlossaryPopoverDefinition
        term="Calendar Year"
        page="Debt explainer"
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      >
        calendar year
      </GlossaryPopoverDefinition>
    ),
    interestRates: (
      <GlossaryPopoverDefinition
        term="Interest Rates"
        page="Debt explainer"
        glossary={glossary}
        glossaryClickHandler={glossaryClickHandler}
      >
        interest rates
      </GlossaryPopoverDefinition>
    ),
  };

  const {
    endpoint,
    getQueryString,
    transformer,
    multichart,
  } = nationalDebtSectionConfigs[sectionId];

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
      const fetchers = [];
      localMultichartConfigs.forEach(chartConfig => {
        fetchers.push(
          basicFetch(chartConfig.dataSourceUrl)
            .then(response => {
              if(response.data) {
                const xAxisTickValues = [];
                for (let i = 0, il = response.data.length; i < il; i += 1) {
                  const tickValue = new Date(
                    response.data[i][chartConfig.dateField]
                  );
                  xAxisTickValues.push(tickValue);
                }
                chartConfig.options.xAxisTickValues = xAxisTickValues;
                chartConfig.data = response.data;
              }
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
        if(dataPopulatedConfigs[0].data) {
          setMultichartStartYear(
            dataPopulatedConfigs[0].data[dataPopulatedConfigs[0].data.length - 1].record_calendar_year
          );
          setMultichartEndYear(dataPopulatedConfigs[0].data[0].record_calendar_year);
          sortedInterestRates = [...dataPopulatedConfigs[0].data].sort((a, b) => {
              return a.avg_interest_rate_amt - b.avg_interest_rate_amt;
            }
          );
          setMultichartInterestRateMin(
            percentageFormatter(sortedInterestRates[0].avg_interest_rate_amt)
          );
          setMultichartInterestRateMax(
            percentageFormatter(sortedInterestRates[sortedInterestRates.length - 1].avg_interest_rate_amt)
          );
        }
      });

  }, [] );

  useEffect(() => {
    if (multichartConfigs && multichartConfigs.length > 1) {
      if (multichartConfigs.every(config => config.data && config.data.length)) {
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
      <IntragovernmentalHoldingsChart sectionId={sectionId} data={data} date={date} width={width} />
      <div className={postGraphContent} id={'maintaining-national-debt'}>
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
          {debtExpensePercent} of the total {spendingLink('federal spending')}.
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
            <div
              className={multichartWrapper}
              aria-label={"Combined line and area chart comparing average interest rate and total debt trends over " +
                "the last decade, ranging from " + multichartInterestRateMax + " to " + multichartInterestRateMin
              }
              role={'img'}
            >
              <div
                className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}
                onMouseEnter={handleMouseEnterInterestChart}
                onMouseLeave={handleMouseLeaveInterestChart}
                role={'presentation'}
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
                <div className={`${multichartContainer} multichart-scaled`}>
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
              When interest rates remain low over time, interest expense on the debt paid by
              the federal government will remain stable, even as the federal debt increases. As
              interest rates increase, the cost of maintaining the national debt also increases.
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
              which is conducted by the Federal Reserve. Monetary policy involves controlling the
              supply of money and the cost of borrowing. The Federal Reserve uses monetary policy
              to promote maximum employment, stable prices, and moderate long-term interest rates
              on the behalf of Congress. The federal government uses fiscal policy, or the control
              of taxation and {spendingLink('government spending')}, to promote economic
              activity.
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
}


export default withWindowSize(BreakingDownTheDebt);
