import React, { useEffect, useRef, useState } from "react"
import { ResponsiveLine } from '@nivo/line';
import { withWindowSize } from 'react-fns';
import { format, getYear } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faPercent,
  faPollH,
  faDollarSign,
  faHandHoldingMedical,
  faHeartbeat,
  faShieldAlt,
  faUserFriends,
  faSpinner,
  faFunnelDollar,
  faCoins,
  faFileInvoiceDollar
} from '@fortawesome/free-solid-svg-icons';
import Accordion from '../../../../components/accordion/accordion';
import VisualizationCallout
  from "../../../../components/visualization-callout/visualization-callout";
import { visWithCallout, chartBackdrop } from "../../explainer.module.scss";
import drawChart, {
  addHoverEffects,
  removeHoverEffects
} from '../../../../components/charts/chart-primary';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import simplifyNumber from '../../../../helpers/simplify-number/simplifyNumber';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import {
  datasetSectionConfig,
  getDateWithoutOffset
} from '../../explainer-helpers/explainer-helpers';
import {
  breakpointLg,
  breakpointSm,
  fontBodyCopy,
  fontSize_10,
  fontSize_14,
  fontSize_16,
  fontSize_36,
  debtExplainerPrimary
} from '../../../../variables.module.scss';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import curvedArrow from '../../../../images/curved-arrow.svg';
import alexanderHamilton from '../../../../images/alexander-hamilton.png';
import benFranklin from '../../../../images/ben-franklin.png';

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
  headerContainer,
  header,
  subHeader,
  footerContainer,
  debtBreakdownSectionGraphContainer,
  barChartContainer,
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
  fundingProgramsBox,
  //Accordion styling
  debtAccordion,
  debtTrendsOverTimeSectionGraphContainer,
  subTitle,
  titleBreakdown,
  postGraphAccordionContainer
} from './national-debt.module.scss';
import { Bar } from '@nivo/bar';
import Multichart from "../../multichart/multichart"

const sampleCopy = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
  in culpa qui officia deserunt mollit anim id est laborum.
`

const smallSampleCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua.`

export const nationalDebtSectionConfigs = datasetSectionConfig['national-debt'];

export const nationalDebtSectionIds = [
  'key-takeaways',
  'national-debt-explained',
  'funding-programs',
  'growing-national-debt',
  'breakdown',
  'debt-ceiling',
  'debt-tracking',
  'dive-deeper'
];

export const nationalDebtExplainedTableContent = {
  header: [
    null,
    <FontAwesomeIcon icon={faCoins} className={tableIcon} />,
    <FontAwesomeIcon icon={faFunnelDollar} className={tableIcon} />,
    <FontAwesomeIcon icon={faFileInvoiceDollar} className={tableIcon} />,
    null
  ],
  body: [
    [
      null,
      'Revenue',
      'Spending',
      'Deficit',
      null
    ],
    [
      'Year 1',
      '$400',
      '$500',
      '-$100',
      null
    ],
    [
      'Year 2',
      '$600',
      '$800',
      '-$200',
      null
    ],
    [
      null,
      null,
      null,
      '-$300',
      'Debt'
    ]
  ],
  footer: [
    null,
    null,
    null,
    <img src={curvedArrow} alt="" />
  ]
}

export const visualizingTheDebtTableContent = {
  desktop: {
    rows: 20,
    columns: 50
  },
  mobile: {
    rows: 50,
    columns: 20
  }
}

export const chartPatternBackground = '#4A0072';
const alternateBarColor = '#b699c6';

const KeyTakeawaysSection = () => (
  <>
    <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faChartLine} className={icon} />
          <FontAwesomeIcon icon={faChartLine} className={offsetIcon} />
        </div>
        <p>The national debt has steadily increased since 2000.</p>
    </div>
      <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faPollH} className={icon} />
          <FontAwesomeIcon icon={faPollH} className={offsetIcon} />
        </div>
        <p>
          Different parts of the debt impact the health and stability of our
          national debt, including gross domestic product (GDP), interest rates,
          and various economic trends.
        </p>
      </div>
      <div className={`${keyTakeawaysContent} ${noMarginBottom}`}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faPercent} className={icon} />
          <FontAwesomeIcon icon={faPercent} className={offsetIcon} />
        </div>
        <p>
          The national debt is often accessed by looking at debt over time or
          the ratio of the federal
          debt related to GDP.
        </p>
      </div>
  </>
);


export const NationalDebtExplainedSection = () => {

  return (
  <>
    <div className={visWithCallout}>
      <div className={nationalDebtExplainedTextContent}>
        <p>{sampleCopy}{sampleCopy}</p>
      </div>
      <VisualizationCallout color={debtExplainerPrimary}>
        <p>{smallSampleCopy}</p>
      </VisualizationCallout>
    </div>
    <div className={nationalDebtExplainedTable}>
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
                const borderBottomEl = i === nationalDebtExplainedTableContent.body.length - 2
                  && j === tb.length - 2;

                // last element in last row before footer
                const boldEl = i === 0 || (
                  i === nationalDebtExplainedTableContent.body.length - 1 && j === tb.length - 1
                );

                return (
                  <td className={borderBottomEl ? borderBottom : ''} key={j}>
                    {boldEl ? (<strong>{t}</strong>) : t}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            {nationalDebtExplainedTableContent.footer.map((tf, i) => (
              <td colSpan={tf !== null ? 2 : 1} key={i}>{tf}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  </>
  )
};


const FundingProgramsSection = () => (
    <>
      <p>{sampleCopy}</p>
      <div className={debtAccordion}>
        <Accordion title="What are some of the major spending categories?"
        altStyleAccordion={{padding:'9px 16px'}}
        >
          {sampleCopy}
          <div className={spendingCategoriesTable}>
            <div className={row}>
              <div className={firstColumn}>
                <FontAwesomeIcon icon={faDollarSign} className={icon} />
              </div>
              <div className={secondColumn}>
                <strong>Income Security</strong>
                <p>
                  Unemployment Compensation, Other Income Security, Federal Employee Retirement and
                  Disability, Food and Nutrition Assistance
                </p>
              </div>
            </div>
            <div className={row}>
              <div className={firstColumn}>
                <FontAwesomeIcon icon={faUserFriends} className={icon} />
              </div>
              <div className={secondColumn}>
                <strong>Social Security</strong>
                <p>{smallSampleCopy}</p>
              </div>
            </div>
            <div className={row}>
              <div className={firstColumn}>
                <FontAwesomeIcon icon={faHandHoldingMedical} className={icon} />
              </div>
              <div className={secondColumn}>
                <strong>Medicare</strong>
                <p>{smallSampleCopy}</p>
              </div>
            </div>
            <div className={row}>
              <div className={firstColumn}>
                <FontAwesomeIcon icon={faShieldAlt} className={icon} />
              </div>
              <div className={secondColumn}>
                <strong>National Defense</strong>
                <p>
                  Department of Defense - Military Programs, Atomic Energy Defense Activities,
                  Defense-Related Activities
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
                  Health Care Services, Heath Research and Training,
                  Consumer and Occupational Health and Safety
                </p>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
      <div className={fundingProgramsBox}>
        <p>{sampleCopy}</p>
      </div>
    </>
);

export const VisualizingTheDebtAccordion = ({ width }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(visualizingTheDebtTableContent.desktop.rows);
  const [columns, setColumns] = useState(visualizingTheDebtTableContent.desktop.columns);
  const [nationalDebtValue, setNationalDebtValue] = useState("99999999999999.99");
  const [nationalDebtValueInTenths, setNationalDebtValueInTenths] = useState("99999999999999.9");
  const [numberOfSquares, setNumberOfSquares] = useState("0");

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
          {row.map((index) => <td key={index} className={rectangle} />)}
        </tr>
      )
    }

    return (
      <tbody>
        {table.map((tr) => tr)}
      </tbody>
    )
  }

  const fields = 'fields=tot_pub_debt_out_amt,record_date';
  const sort = 'sort=-record_date';
  const pagination = 'page[size]=1&page[number]=1';
  const endpointUrl = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpointUrl}`)
      .then((res) => {
        if (res.data) {
          const totalPublicDebtOutstanding = Math.trunc(res.data[0]['tot_pub_debt_out_amt']);
          const dividedDebt = (totalPublicDebtOutstanding / 1000000000000);
          setNationalDebtValue(dividedDebt.toFixed());
          setNationalDebtValueInTenths(dividedDebt.toFixed(1));
          setNumberOfSquares((dividedDebt * 1000).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
      });
  }, [])


  return (
    <div className={debtAccordion}>
      <Accordion
        title={`Visualizing the debt - How much is $${nationalDebtValue} trillion dollars?`}
        containerClass={growingNationalDebtSectionAccordion}
      >
        <div className={accordionHeader}>
          <p>If this is 1 billion:</p>
          <div className={rectangle} />
          <p>Then this is 1 trillion:</p>
        </div>
        {!isLoading && (
          <table className={accordionTable}>
            {drawTable()}
          </table>
        )}
        <div className={accordionFooter}>
          <p>(1000 squares drawn to scale.)</p>
          <p>
            {`Today's debt is $${nationalDebtValueInTenths}T, that's ${numberOfSquares} squares.`}
          </p>
        </div>
      </Accordion>
    </div>
  );
};

export const GrowingNationalDebtSection = withWindowSize(({ sectionId, width }) => {
  const chartId = `${sectionId}-chart`;
  const chartOptions = {
    forceHeight: width < pxToNumber(breakpointLg) ? 200 : 400,
    forceLabelFontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    format: true,
    yAxisTickNumber: 5,
    showOuterXAxisTicks: true,
    placeInitialMarker: true,
    noTooltip: true,
    noShaders: true,
    noInnerXAxisTicks: true,
    shading: {
      side: 'under',
      color: chartPatternBackground
    }
  }

  const [data, setData] = useState({});
  const [date, setDate] = useState('');
  const [value, setValue] = useState(0);
  const [tempDate, setTempDate] = useState(null);
  const [tempValue, setTempValue] = useState(0);
  const [labels, setLabels] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lineChartHoveredYear, setLinechartHoveredYear] = useState('');
  const [lineChartHoveredValue, setLinechartHoveredValue] = useState('');

  const chartRef = useRef();

  const { name, slug, dateField, valueField, endpoint } = nationalDebtSectionConfigs[sectionId];

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
        handleChange
      );
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      removeHoverEffects();
      setTempDate(null);
      setTempValue(0);
    }, 500)
  };

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpoint}`)
      .then((dataset) => {
        const latestEntry = dataset.data[0];
        // Use window.innerWidth instead of width prop because this doesn't trigger on mount
        chartOptions.forceHeight = window.innerWidth < pxToNumber(breakpointLg) ? 200 : 400;
        chartOptions.forceLabelFontSize = window.innerWidth < pxToNumber(breakpointLg) ?
          fontSize_10 : fontSize_14;

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
        setLabels(dataset.meta.labels)
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
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    chartOptions.forceHeight = width < pxToNumber(breakpointLg) ? 200 : 400;
    const xAxisTickValues = [];
    const step = Math.floor(data.length / 5);
    for (let i = 0, il = data.length; i < il; i += step) {
      const tickValue = new Date(data[i][dateField])
      xAxisTickValues.push(tickValue)
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
      )
    }
  }, [width]);

  // Account for time zone offset since there is no time stamp in the date field
  const dateWithoutOffset = getDateWithoutOffset(date);

  const displayDate = tempDate ? getYear(new Date(tempDate)) : getYear(dateWithoutOffset);
  const displayValue = tempDate ? simplifyNumber(tempValue, true) : simplifyNumber(value, true);


  // Below are the configs for custom properties for the debt trends over time line chart

  const [debtTrendsData, setDebtTrendsData] = useState([]);
  const [isLoadingDebtTrends, setIsLoadingDebtTrends] = useState(true);
  const [lastDebtValue, setLastDebtValue] = useState({});

  const debtEndpointUrl =
    'v2/accounting/od/debt_outstanding?sort=-record_date&filter=record_fiscal_year:gte:1948';

  useEffect(() => {
    basicFetch(`${apiPrefix}${debtEndpointUrl}`)
    .then((res) => {
      if (res.data) {
        const debtData = res.data;
        basicFetch(`https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON`)
        .then((res) => {
          if(res.BEAAPI.Results.Data) {
            const gdpData = res.BEAAPI.Results.Data
              .filter(entry => entry.LineDescription === 'Gross domestic product');
            const averagedGDPByYear = [];
            for (let i = parseInt(debtData[debtData.length - 1].record_fiscal_year);
                i <= parseInt(debtData[0].record_fiscal_year); i++) {
              const allQuartersForGivenYear = gdpData
                .filter(entry => entry.TimePeriod.includes(i.toString()));
              let totalGDP = 0;
              allQuartersForGivenYear.forEach(quarter => {
                totalGDP += parseFloat(quarter.DataValue.replace(/,/g, ''));
              })
              averagedGDPByYear.push({
                // Correct BEA data to display in trillions
                average: ((parseInt(String(totalGDP) + '000000')) / 4),
                year: i
              })
            }
            const debtToGDP = [];
            averagedGDPByYear.forEach(GDPEntry => {
              const record = debtData.find(entry => entry.record_date.includes(GDPEntry.year));
              debtToGDP.push({
                "x": GDPEntry.year,
                "y": Math.round(
                  ((parseFloat(record.debt_outstanding_amt) / GDPEntry.average) * 100))
              })
            });
            const finalData = [
              {
                "id": "us",
                "color": "hsl(219, 70%, 50%)",
                "data": debtToGDP
              }
            ]
            setDebtTrendsData(finalData);
            setLastDebtValue(finalData[0].data[finalData[0].data.length - 1]);
            setIsLoadingDebtTrends(false);
          }
        });
      }
    });
  }, [])

  const chartBorderTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    axis: {
      domain: {
        line: {
          stroke: '#666666',
          strokeWidth: 1,
        }
      }
    }
  }

  const formatPercentage = v => `${v}%`;

  const CustomPoint = (props) => {
    const { currentPoint, borderWidth, borderColor, points } = props;
    if (!isLoadingDebtTrends) {
      if (currentPoint) {
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
      } else {
        const lastPoint = points[points.length - 1];
        return (
          <g>
            <circle
              fill={"#D8D8D8"}
              r={8}
              strokeWidth={borderWidth}
              stroke={borderColor}
              fillOpacity={0.35}
              cx={lastPoint.x}
              cy={lastPoint.y}
            />
            <circle
              r={2}
              strokeWidth={"4"}
              stroke={"#000000"}
              fill={"#000000"}
              fillOpacity={0.85}
              cx={lastPoint.x}
              cy={lastPoint.y}
            />
          </g>
        );
      }
    }
  };

  const lineChartOnMouseMove = (point) => {
    setLinechartHoveredValue(formatPercentage(point.data.y));
    setLinechartHoveredYear(point.data.x);
  };

  const lineChartOnMouseLeave = () => {
    setLinechartHoveredValue(formatPercentage(lastDebtValue.y));
    setLinechartHoveredYear(lastDebtValue.x);
  };

  return (
    <div className={growingNationalDebt}>
      <p>{sampleCopy}</p>
      {!isLoading ? (
        <div className={visWithCallout}>
          <div>
            <div
              className={`${growingNationalDebtSectionGraphContainer} ${chartBackdrop}`}
            >
              <p className={title}>
                U.S. Federal Debt Total of the Last 100 Years,
                {' '}{getYear(dateWithoutOffset) - 100} - {getYear(dateWithoutOffset)}
              </p>
              <p className={subTitle}> (Inflation Adjusted - 2021 Dollars) </p>
              <div className={headerContainer}>
                <div>
                  <div className={header}>{displayDate}</div>
                  <span className={subHeader}>Year</span>
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
                <CustomLink url={slug}>
                  Visit our dataset page to explore and download this data, {name}.
                </CustomLink>
                <p>
                  Last updated: {format(dateWithoutOffset, 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
          <VisualizationCallout color={debtExplainerPrimary}>
            <p>The U.S. has steadily increased the federal debt since 2000.</p>
          </VisualizationCallout>
        </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      <p>{sampleCopy}</p>
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
                  Federal Debt Trends Over Time, {debtTrendsData[0].data[0].x} to {lastDebtValue.x}
                </p>
                <p className={subTitle}> Debt to Gross Domestic Product (GDP) </p>
                <div className={headerContainer}>
                  <div>
                    <div className={header}>
                      {lineChartHoveredYear === '' ? lastDebtValue.x : lineChartHoveredYear}
                    </div>
                    <span className={subHeader}>Fiscal Year</span>
                  </div>
                  <div>
                    <div className={header}>
                      {lineChartHoveredValue === '' ? lastDebtValue.y + '%' : lineChartHoveredValue}
                    </div>
                    <span className={subHeader}>Debt to GDP</span>
                  </div>
                </div>
                <div
                  className={`${lineChartContainer} ${chartBackdrop}`}
                  data-testid={"debtTrendsChart"}
                  role={"img"}
                  aria-label={`Line graph displaying the federal debt to GDP trend over time from ${debtTrendsData[0].data[0].x} to ${lastDebtValue.x}.`}
                >
                  <ResponsiveLine
                    data={debtTrendsData}
                    theme={chartBorderTheme}
                    layers={[
                      'grid',
                      'lines',
                      'axes',
                      CustomPoint,
                      'mesh'
                    ]}
                    margin={width < pxToNumber(breakpointLg) ?
                      { top: 8, right: 15, bottom: 30, left: 30 } :
                      { top: 8, right: 15, bottom: 30, left: 40 }}
                    xScale={{
                      type: 'linear',
                      min: 1940,
                      max: 2030
                    }}
                    yScale={{
                      type: 'linear',
                      min: 0,
                      max: 140,
                      stacked: true,
                      reverse: false
                    }}
                    yFormat=" >-.2f"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                      orient: 'bottom',
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      tickValues: 9
                    }}
                    axisLeft={{
                      format: formatPercentage,
                      orient: 'left',
                      tickSize: 0,
                      tickValues: 8
                    }}
                    enablePoints={false}
                    pointSize={0}
                    pointColor={debtExplainerPrimary}
                    pointBorderWidth={2}
                    pointBorderColor={debtExplainerPrimary}
                    pointLabelYOffset={-12}
                    colors={debtExplainerPrimary}
                    useMesh={true}
                    enableGridY={true}
                    gridYValues={8}
                    enableGridX={false}
                    enableCrosshair={false}
                    animate={true}
                    onMouseMove={lineChartOnMouseMove}
                    onMouseLeave={lineChartOnMouseLeave}
                  />
                </div>
                <div className={footerContainer}>
                  <p> Visit the {' '}
                    <CustomLink url={slug}>
                    {name}
                    </CustomLink>{' '} dataset to explore and download this data.
                    The GDP data is sourced from the {' '}
                    <CustomLink url={"https://www.bea.gov/"}>
                      Bureau of Economic Analysis
                    </CustomLink>.
                  </p>
                  <p>
                    Last updated: {format(dateWithoutOffset, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

            </div>
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                When adjusted for inflation,
                the U.S. federal debt has steadily increased since 2001.
                Without adjusting for inflation,
                the U.S. federal debt has steadily increased since 1957.
                Another way to view the federal debt over time
                is to look at the ratio of federal debt related to GDP.
                The ratio has increased over time.
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
});

export const percentageFormatter = (value) => Number(value).toFixed(2) + '%';
export const trillionsFormatter = (value) => `$${(Number(value) / 1000000).toFixed(1)} T`;

export const DebtBreakdownSection = withWindowSize(({ sectionId, width }) => {
  const [data, setData] = useState();
  const [date, setDate] = useState(new Date ());
  const [isChartRendered, setIsChartRendered] = useState(false);
  const [multichartConfigs, setMultichartConfigs] = useState([]);
  const [multichartDataLoaded, setMultichartDataLoaded] = useState(false);
  const [debtValue, setDebtValue] = useState('0');
  const [interestValue, setInterestValue] = useState('0');
  const [focalYear, setFocalYear] = useState(1900);
  const [multichartStartYear, setMultichartStartYear] = useState('');
  const [multichartEndYear, setMultichartEndYear] = useState('');

  const {
    name,
    slug,
    endpoint,
    getQueryString,
    transformer,
    multichart
  } = nationalDebtSectionConfigs[sectionId];


  const fiveTheme = {
    fontSize: fontSize_16,
    textColor: fontBodyCopy,
    markers: {
      lineStrokeWidth: 0
    },
    grid: {
      line: {
        stroke: fontBodyCopy,
        strokeWidth: 2
      }
    },
    legends: {
      text: {
        fontSize: fontSize_16
      }
    }
  };

  const layers = ['grid', 'axes', 'bars', 'markers', 'legends', 'annotations'];

  const sideMarkerPos = {
    axis: 'y',
    legendOffsetY: -22,
  };
  const markerText = {
    fontSize: fontSize_36,
    fill: fontBodyCopy,
    fontWeight: 'bold'
  };
  const sideMarkerLeft = {
    ...sideMarkerPos,
    legendOffsetX: 228,
    textStyle: markerText
  };
  const sideMarkerRight = {
    ...sideMarkerPos,
    legendOffsetX: 8,
    textStyle: {
      ...markerText,
      textAnchor: 'start'
    }
  };

  const calcPercentIncrease = (key, rows) =>
    Math.round(((rows[1][key] - rows[0][key]) / rows[0][key]) * 100).toFixed();

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="breakdownChart"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 524 500');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  // generate rectangular color swatches in footer legend
  const CustomSymbolShape =
    ({ x, y, size, fill, borderWidth, borderColor }) => {

      return (
        <rect
          x={x}
          y={y}
          fill={fill}
          strokeWidth={borderWidth}
          stroke={borderColor}
          width={size * 2}
          height={size}
          style={{ pointerEvents: 'none' }}
        />
      )
    };


  const chartOptions = {
    forceHeight: 400,
    forceYAxisWidth: 60,
    forceLabelFontSize: width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
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
      fontColor: '#666666',
      fontWeight: 600
    }
  }

  const interestChartOptions = Object.assign({ inverted: false }, chartOptions);
  const amountChartOptions = Object.assign({
    inverted: true,
    shading: {
      side: 'under',
      color: chartPatternBackground
    }
  }, chartOptions);

  const localMultichartConfigs = [
    {
      name: 'interest',
      dataSourceUrl: `${apiPrefix}${multichart.endpoints[0].path}`,
      dateField: multichart.endpoints[0].dateField,
      fields: [multichart.endpoints[0].valueField],
      options: interestChartOptions,
      marginLabelFormatter: percentageFormatter,
      marginLabelLeft: true,
      marginLabelRight: true,
      zeroMarginLabelLeft: true,
    }, {
      name: 'debt',
      dataSourceUrl: `${apiPrefix}${multichart.endpoints[1].path}`,
      dateField: multichart.endpoints[1].dateField,
      fields: [multichart.endpoints[1].valueField],
      options: amountChartOptions,
      marginLabelFormatter: trillionsFormatter,
      marginLabelLeft: true,
      marginLabelRight: true
    }
  ];

  const hoverEffectHandler = (recordDate) => {
    const year = recordDate === null ?
      multichartConfigs[0].data[0][multichartConfigs[0].dateField].substring(0, 4) :
       recordDate.substring(0,4);
    if (multichartConfigs[0].data && multichartConfigs[1].data) {
      const interestRow = multichartConfigs[0].data
        .find(row => row[multichartConfigs[0].dateField].indexOf(year) === 0);
      const interest = percentageFormatter(interestRow[multichartConfigs[0].fields[0]]);

      const debtRow = multichartConfigs[1].data
        .find(row => row[multichartConfigs[1].dateField].indexOf(year) === 0);
      const debt = trillionsFormatter(debtRow[multichartConfigs[1].fields[0]]);
      setInterestValue(interest);
      setDebtValue(debt);
      setFocalYear(year);
    }
  };

  useEffect(() => {
    if (isChartRendered) {
      applyChartScaling();

      const fetchers = [];
      localMultichartConfigs.forEach((chartConfig) => {

        fetchers.push(basicFetch(chartConfig.dataSourceUrl).then(response => {
          const xAxisTickValues = [];
          for (let i = 0, il = response.data.length; i < il; i += 1) {
            const tickValue = new Date(response.data[i][chartConfig.dateField]);
            xAxisTickValues.push(tickValue);
          }
          chartConfig.options.xAxisTickValues = xAxisTickValues;
          chartConfig.data = response.data;

          }).catch((err) => {
          console.error(err);
        }));
      });

      Promise.all(fetchers).then(() => {
        const dataPopulatedConfigs = [];
        localMultichartConfigs.forEach((config) => {
          dataPopulatedConfigs.push(Object.assign({}, config));
        });
        setMultichartConfigs(dataPopulatedConfigs);
        setMultichartStartYear(dataPopulatedConfigs[0]
          .data[dataPopulatedConfigs[0].data.length - 1].record_calendar_year);
        setMultichartEndYear(dataPopulatedConfigs[0].data[0].record_calendar_year);
      });
    }
  }, [isChartRendered]);

  useEffect(() => {
    if (multichartConfigs && multichartConfigs.length > 1) {
      if (multichartConfigs.every(config => config.data && config.data.length)) {
        setMultichartDataLoaded(true);
      }
    }
  }, [multichartConfigs]);

  useEffect(() => {
    if (multichartDataLoaded) {
      hoverEffectHandler(multichartConfigs[0].data[0][multichartConfigs[0].dateField])
    }
  }, [multichartDataLoaded]);

  const multichartId = 'interestToDebt';

  useEffect(() => {
    basicFetch(`${apiPrefix}${endpoint}${getQueryString()}`)
      .then(response => {
        const transformed = transformer(response);
        if (transformed && transformed.length === 2) {
          setData(transformed);
          setDate(getDateWithoutOffset(transformed[1].record_date))
        }
      });
  }, []);

  return (
    <>
      <p>{sampleCopy}</p>
      <p>{sampleCopy} </p>
      <div className={visWithCallout}>
        {!data && (
          <div>
            <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
          </div>
        )}
        {data && (
          <>
            <div>
              <div className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}>
                <p className={titleBreakdown}>
                  Intragovernmental Holdings and Debt Held by the Public,
                  {' '}{data[0].record_calendar_year} and {data[1].record_calendar_year}
                </p>
                <div
                  data-testid="breakdownChart"
                  className={barChartContainer}
                >
                  <Bar
                    width={524}
                    height={468}
                    data={data}
                    keys={['Intragovernmental Holdings', 'Debt Held by the Public']}
                    indexBy="record_calendar_year"
                    margin={{ top: 30, right: 144, bottom: 50, left: 144 }}
                    padding={0.24}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={[alternateBarColor, chartPatternBackground]}
                    isInteractive={false}
                    borderColor={fontBodyCopy}
                    axisTop={null}
                    axisRight={null}
                    axisLeft={null}
                    axisBottom={{
                      tickSize: 0,
                      tickPadding: 5,
                      tickRotation: 0
                    }}
                    enableGridY={true}
                    gridYValues={[0]}
                    markers={[
                      {
                        ...sideMarkerLeft,
                        value: data[0]['Intragovernmental Holdings'],
                        legend: `$${data[0]['Intragovernmental Holdings'].toFixed(1)} T`
                      },
                      {
                        ...sideMarkerLeft,
                        value: data[0].total,
                        legend: `$${data[0]['Debt Held by the Public'].toFixed(1)} T`
                      },
                      {
                        ...sideMarkerRight,
                        value: data[1]['Intragovernmental Holdings'],
                        legend: `$${data[1]['Intragovernmental Holdings'].toFixed(1)} T`
                      },
                      {
                        ...sideMarkerRight,
                        value: data[1].total,
                        legend: `$${data[1]['Debt Held by the Public'].toFixed(1)} T`
                      }
                    ]}
                    enableLabel={false}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor={fontBodyCopy}
                    legends={[
                      {
                        dataFrom: 'keys',
                        anchor: 'bottom-left',
                        direction: 'row',
                        justify: false,
                        translateX: -125,
                        translateY: 90,
                        itemsSpacing: 15,
                        itemWidth: 250,
                        itemHeight: 40,
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 20,
                        symbolShape: CustomSymbolShape,
                        symbolSpacing: 28
                      }
                    ]}
                    layers={[
                      ...layers,
                      () => {
                        // this final empty layer fn is called only after everything else is
                        // rendered, so it serves as a handy postRender hook.
                        // It's wrapped in a setTimout to avoid triggering a browser warning
                        setTimeout(() => setIsChartRendered(true));
                        return (<></>);
                      }
                    ]}
                    ariaLabel="Chart of Debt Breakdown"
                    theme={fiveTheme}
                  />
                </div>
                <div className={footerContainer}>
                  <CustomLink url={slug}>
                    Visit our dataset page to explore and download this data, {name}.
                  </CustomLink>
                  <p>
                    Last updated: {format(date, 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

            </div>
            <VisualizationCallout color={debtExplainerPrimary}>
              <p>
                There are two major categories for federal debt: debt held by the public
                and intragovernmental holdings.
              </p>

              <p>
                The debt held by the public has increased by
                {' '}
                <span data-testid={'public-debt-increase'}>
                  {calcPercentIncrease('Debt Held by the Public', data)}%
                </span>
                {' '}
                since {data[0].record_calendar_year}. Intragovernmental holdings increased by
                {' '}
                <span data-testid={'govt-debt-increase'}>
                  {calcPercentIncrease('Intragovernmental Holdings', data)}%
                </span>
                {' '}
                since {data[0].record_calendar_year}.
              </p>
            </VisualizationCallout>
          </>
        )}
      </div>
      <div className={postGraphContent}>
        <h3>Maintaining the National Debt</h3>
      </div>
      <p>
        The federal government is charged interest for the use of lenders’ money, in the
        same way that lenders charge an individual interest for a car loan or mortgage.
        How much the government pays in interest depends on the total national debt
        and the various securities’ interest rates.
      </p>
      <p>
        As of December {multichartEndYear} it costs $XX.XX trillion to maintain the debt which is
        XX.XX%  of the total federal debt.
      </p>
      <p>
        Although the national debt has increased every year over the past ten years,
        interest expenses have remained fairly stable due to low interest rates and
        investors’ perception that the U.S. government has a very low risk of default.
      </p>
        <div className={visWithCallout}>
          {multichartDataLoaded && (

          <div>
            <div className={`${debtBreakdownSectionGraphContainer} ${chartBackdrop}`}>
              <p className={title}>
                Interest Rate and Total
                Debt, {multichartStartYear} – {multichartEndYear}
              </p>
              <div className={headerContainer} data-testid="interest-and-debt-chart-header">
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
                <Multichart chartId={multichartId}
                            chartConfigs={multichartConfigs}
                            hoverEffectHandler={hoverEffectHandler}
                />
              </div>
              <div className={multichartLegend} data-testid="interest-and-debt-chart-legend">
                <div><div className={aveInterestLegend} />
                  <div>Average Interest Rate</div>
                </div>
                <div><div className={debtLegend} />
                  <div>Total Debt</div>
                </div>
              </div>
              <div className={footerContainer}>
                <p>
                  Visit the {' '}
                  <CustomLink url={'/datasets/debt-to-the-penny/'}>
                    Average Interest Rates on U.S. Treasury  Securities
                  </CustomLink>
                  {' '} and {' '}
                  <CustomLink url={'/'}>
                    U.S. Treasury Monthly Statement
                    of the Public Debt (MSPD)
                  </CustomLink>
                  {' '} datasets to explore and download this data.
                </p>
                <p>
                  Last updated: December {multichartEndYear}
                </p>
              </div>
            </div>
          </div>
          )}
          <VisualizationCallout color={debtExplainerPrimary}>
            <p>
              Interest rates have fallen over the past decade. Due to lower interest rates,
              interest expenses on the debt paid by the federal government have remained stable
              even as the federal debt has increased.
            </p>
          </VisualizationCallout>
        </div>
        <div className={postGraphAccordionContainer}>
          <div className={debtAccordion}>
            <Accordion title="Why can't the government just print more money?">
              {sampleCopy}
            </Accordion>
          </div>
        </div>
    </>
  );
});

export const debtCeilingSectionAccordionTitle =
  'How is the debt ceiling different from a government shutdown?';

export const DebtCeilingSection = () => (
  <>
    <p>{ sampleCopy }</p>
    <div className={debtAccordion}>
      <Accordion title={ debtCeilingSectionAccordionTitle }>
        {sampleCopy}
      </Accordion>
    </div>
  </>
);

const DebtTrackingSection = () => (
  <>
    <p>{sampleCopy}</p>
  </>
);

export const DiveDeeperSection = () => (
  <>
    <p>{smallSampleCopy}</p>
    <div className={diveDeeperLink}>
      <strong>The most recent U.S. Government Financial Report</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>America's Fiscal Future: Federal Debt</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>The Debt Veiling: An Explainer</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>Federal Borrowing and Debt</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>Federal Net Interest Costs: A Primer</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>Is the Federal Reserve Printing Money in Order to Buy Treasury Securities?</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>Options for Reducing Deficit</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>Treasury Bulletin</strong>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={diveDeeperLink}>
      <strong>USAspending</strong>
      <p>{smallSampleCopy}</p>
    </div>

    <div className={diveDeeperQuoteRight} >
      <img src={benFranklin} alt="" />
      <p>"{smallSampleCopy}"</p>
    </div>
    <div className={diveDeeperQuoteLeft}>
      <p>"{smallSampleCopy}"</p>
      <img src={alexanderHamilton} alt="" />
    </div>
  </>
);

const nationalDebtSections = [
  {
    index: 0,
    id: nationalDebtSectionIds[0],
    title: 'Key Takeaways',
    component: <KeyTakeawaysSection />
  },
  {
    index: 1,
    id: nationalDebtSectionIds[1],
    title: 'The National Debt Explained',
    component: <NationalDebtExplainedSection />
  },
  {
    index: 2,
    id: nationalDebtSectionIds[2],
    title: 'Funding Programs & Services',
    component: <FundingProgramsSection />
  },
  {
    index: 3,
    id: nationalDebtSectionIds[3],
    title: 'The Growing National Debt',
    component: <GrowingNationalDebtSection sectionId={nationalDebtSectionIds[3]} />
  },
  {
    index: 4,
    id: nationalDebtSectionIds[4],
    title: 'Breaking Down the Debt',
    component: <DebtBreakdownSection sectionId={nationalDebtSectionIds[4]} />
  },
  {
    index: 5,
    id: nationalDebtSectionIds[5],
    title: 'The Debt Ceiling',
    component: <DebtCeilingSection />
  },
  {
    index: 6,
    id: nationalDebtSectionIds[6],
    title: 'Tracking the Debt',
    component: <DebtTrackingSection />
  },
  {
    index: 7,
    id: nationalDebtSectionIds[7],
    title: 'Dive Deeper into the Debt',
    component: <DiveDeeperSection />
  }
]

export default nationalDebtSections;
export const nationalDebtDataSources = (
  <>
    Three different Fiscal Data datasets are used for federal debt values on this
    page. {' '}<CustomLink url={'/datasets/debt-to-the-penny/'}>Debt to the Penny</CustomLink>{' '}
    provides daily values;
    {' '}<CustomLink url={'/datasets/monthly-statement-public-debt/'}>
      Monthly Statement of the Public Debt (MSPD)
         </CustomLink>{' '} December values are used
    for visualizations showing calendar years;
    and {' '}<CustomLink url={'/datasets/historical-debt-outstanding/'}>
      Historical Debt Outstanding
             </CustomLink>{' '} provides an annual value for fiscal years. Interest rates are pulled from the
    {' '}<CustomLink url={'/datasets/average-interest-rates-treasury-securities/'}>
      Average Interest Rates on U.S. Treasury Securities
         </CustomLink>{' '}
    dataset. Adjustments for inflation are calculated using Consumer Price Index values
    from the
    {' '}<CustomLink url={'https://www.bls.gov'}>Bureau of Labor Statistics</CustomLink>.
    Fiscal year Gross Domestic Product values are calculated by averaging four quarterly
    GDP values from the
    {' '}<CustomLink url={'https://www.bls.gov'}>Bureau of Economic Analysis</CustomLink>.
    For detailed documentation, users can reference our
    {' '}<CustomLink url={'https://github.com/fedspendingtransparency/'}>
    Github repository
         </CustomLink>.
  </>
)
