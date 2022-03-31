import React, { useEffect, useRef, useState } from 'react';
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
import sampleImg from '../../../../../static/topic-icons/debt.png'
import Accordion from '../../../../components/accordion/accordion';
import VisualizationCallout
  from "../../../../components/visualization-callout/visualization-callout";
import { visWithCallout } from "../../explainer.module.scss";
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
  fontSize_16, fontSize_36, fontTitle
} from '../../../../variables.module.scss';
import { pxToNumber } from '../../../../helpers/styles-helper/styles-helper';
import curvedArrow from '../../../../images/curved-arrow.svg';

import {
  // First section
  firstSectionContent,
  icon,
  offsetIcon,
  iconBackground,
  noMarginBottom,
  // Second section
  secondSectionTable,
  row,
  firstColumn,
  secondColumn,
  // Third section
  thirdSectionTable,
  tableIcon,
  borderBottom,
  thirdSectionAccordion,
  rectangle,
  accordionHeader,
  accordionTable,
  accordionFooter,
  // Fourth section
  fourthSectionGraphContainer,
  title,
  fourthSectionGraph,
  headerContainer,
  header,
  subHeader,
  footerContainer,
  fifthSectionGraphContainer,
  barChartContainer,
  postGraphContent,
  fourthSection
} from './national-debt.module.scss';
import { Bar } from '@nivo/bar';

const sampleCopy = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
  in culpa qui officia deserunt mollit anim id est laborum.
`

export const nationalDebtSectionConfigs = datasetSectionConfig['national-debt'];

export const nationalDebtSectionIds = [
  'key-takeaways',
  'should-i-care',
  'brief-overview',
  'how-has-the-debt-changed',
  'breakdown',
  'how-is-it-financed',
  'whats-next',
];

export const thirdSectionTableContent = {
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

export const thirdSectionAccordionTableContent = {
  desktop: {
    rows: 20,
    columns: 50
  },
  mobile: {
    rows: 50,
    columns: 20
  }
}

export const chartPatternBackground = '#99e7e7';

const NationalDebtFirstSection = () => (
  <>
    <div className={firstSectionContent}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faChartLine} className={icon} />
        <FontAwesomeIcon icon={faChartLine} className={offsetIcon} />
      </div>
      <p>The national debt has steadily increased since 2000.</p>
    </div>
    <div className={firstSectionContent}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faPollH} className={icon} />
        <FontAwesomeIcon icon={faPollH} className={offsetIcon} />
      </div>
      <p>
        Different parts of the debt impact the health and stability of our national debt, including
        gross domestic product (GDP), interest rates, and various economic trends.
      </p>
    </div>
    <div className={`${firstSectionContent} ${noMarginBottom}`}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faPercent} className={icon} />
        <FontAwesomeIcon icon={faPercent} className={offsetIcon} />
      </div>
      <p>
        The national debt is often accessed by looking at debt over time or the ratio of the federal
        debt related to GDP.
      </p>
    </div>
  </>
);

const NationalDebtSecondSection = () => (
  <>
    <p>{sampleCopy}</p>
    <Accordion title="What are the major spending categories of national debt?">
      <div className={secondSectionTable}>
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
          </div>
        </div>
        <div className={row}>
          <div className={firstColumn}>
            <FontAwesomeIcon icon={faHandHoldingMedical} className={icon} />
          </div>
          <div className={secondColumn}>
            <strong>Medicare</strong>
          </div>
        </div>
        <div className={row}>
          <div className={firstColumn}>
            <FontAwesomeIcon icon={faHeartbeat} className={icon} />
          </div>
          <div className={secondColumn}>
            <strong>Health</strong>
            <p>
              Health Care Services, Heath Research and Training, Consumer and Occupational Health
              and Safety
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
              Department of Defense - Military Programs, Atomic Energy Defense Activities,
              Defense-Related Activities
            </p>
          </div>
        </div>
      </div>
    </Accordion>
    <img src={sampleImg} alt="placeholder alt text" />
    <div>placeholder copy</div>
  </>
);

export const BaseNationalDebtThirdSection = ({ width }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState(thirdSectionAccordionTableContent.desktop.rows);
  const [columns, setColumns] = useState(thirdSectionAccordionTableContent.desktop.columns);

  useEffect(() => {
    setIsLoading(false);

    if (width < pxToNumber(breakpointSm)) {
      setRows(thirdSectionAccordionTableContent.mobile.rows);
      setColumns(thirdSectionAccordionTableContent.mobile.columns);
    } else {
      setRows(thirdSectionAccordionTableContent.desktop.rows);
      setColumns(thirdSectionAccordionTableContent.desktop.columns);
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

  return (
  <>
    <p>{sampleCopy}</p>
    <Accordion title="Another sample title">
      more placeholder accordion content
    </Accordion>
    <div className={thirdSectionTable}>
      <table>
        <thead>
          <tr>
            {thirdSectionTableContent.header.map((th, i) => (
              <th key={i}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {thirdSectionTableContent.body.map((tb, i) => (
            <tr key={i}>
              {tb.map((t, j) => {
                // second-to-last element in second-to-last row before footer
                const borderBottomEl = i === thirdSectionTableContent.body.length - 2
                  && j === tb.length - 2;

                // last element in last row before footer
                const boldEl = i === 0 || (
                  i === thirdSectionTableContent.body.length - 1 && j === tb.length - 1
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
            {thirdSectionTableContent.footer.map((tf, i) => (
              <td colSpan={tf !== null ? 2 : 1} key={i}>{tf}</td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
    <Accordion
      title="How much is a trillion? Hint: it's a really, really big number."
      containerClass={thirdSectionAccordion}
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
        <p>Today's debt is $28.4T, that's YY,YYY squares.</p>
      </div>
    </Accordion>
  </>
  )
};

export const NationalDebtThirdSection = withWindowSize(BaseNationalDebtThirdSection);

export const NationalDebtFourthSection = withWindowSize(({ sectionId, width }) => {
  const chartId = `${sectionId}-chart`;
  const chartOptions = {
    forceHeight: width < pxToNumber(breakpointLg) ? 200 : 400,
    forceYAxisWidth: width < pxToNumber(breakpointLg) ? 36 : undefined,
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
      color: chartPatternBackground,
      hatchDirection: 'down'
    }
  }

  const [data, setData] = useState({});
  const [date, setDate] = useState('');
  const [value, setValue] = useState(0);
  const [tempDate, setTempDate] = useState(null);
  const [tempValue, setTempValue] = useState(0);
  const [labels, setLabels] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      })
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

  return (
    <div className={fourthSection}>
      <p>{sampleCopy}</p>
      {!isLoading ? (
        <div className={visWithCallout}>
          <div>
            <div
              className={fourthSectionGraphContainer}
            >
              <p className={title}>
                U.S. Federal Debt Total of the Last 100 Years,
                {' '}{getYear(dateWithoutOffset) - 100} - {getYear(dateWithoutOffset)}
              </p>
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
                className={fourthSectionGraph}
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
          <VisualizationCallout>
            <p>The U.S. has steadily increased the federal debt since 2000.</p>
          </VisualizationCallout>
        </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
    </div>
  );
});

export const NationalDebtFifthSection = (({ sectionId }) => {
  const [data, setData] = useState();
  const [date, setDate] = useState(new Date ());
  const [isChartRendered, setIsChartRendered] = useState(false);

  const {
    name,
    slug,
    endpoint,
    getQueryString,
    transformer } = nationalDebtSectionConfigs[sectionId];

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
      svgChart.setAttribute('viewBox', '0 0 524 468');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  // generate rectangular color swatches in footer legend
  const CustomSymbolShape =
    ({ x, y, size, fill, borderWidth, borderColor }) => {
      const revisedFill = fill === chartPatternBackground ? 'url(#breakdownLines)' : fill;

      return (
        <rect
          x={x}
          y={y}
          fill={revisedFill}
          strokeWidth={borderWidth}
          stroke={borderColor}
          width={size * 2}
          height={size}
          style={{ pointerEvents: 'none' }}
        />
      )
    };

  useEffect(() => {
    if (isChartRendered) {
      applyChartScaling();
    }
  }, [isChartRendered]);

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
      <p>
        Similar to a person with a credit card, mortgage, or car loan, the federal debt
        consists of different parts. The Treasury Bulletin categorizes ownership of U.S.
        Government securities by the types of investors.
      </p>
      <p>
        In this visual we show the difference between the two major types: debt
        held by the public and intragovernmental holdings.
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
              <div className={fifthSectionGraphContainer}>
                <p className={title}>Intragovernmental Holdings and Debt Held by the Public,
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
                    colors={[fontTitle, chartPatternBackground]}
                    isInteractive={false}
                    defs={[
                      {
                        id: 'breakdownLines',
                        type: 'patternLines',
                        spacing: 5,
                        rotation: 45,
                        lineWidth: 1,
                        background: chartPatternBackground,
                        color: fontBodyCopy
                      }
                    ]}
                    fill={[
                      {
                        match: {
                          id: 'Debt Held by the Public'
                        },
                        id: 'breakdownLines'
                      }
                    ]}
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
                        translateX: -104,
                        translateY: 60,
                        itemsSpacing: 2,
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
            <VisualizationCallout>
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
        <Accordion title="another accordion">
          more content
        </Accordion>
        <p>{sampleCopy}</p>
        <Accordion title="another accordion">
          more content
        </Accordion>
        <p>{sampleCopy}</p>
      </div>
    </>
  );
});

export const sixthSectionAccordionTitle = 'Why can\'t the government just print more money?';

export const NationalDebtSixthSection = () => (
  <>
    <p>{sampleCopy}</p>
    <h4>How much does it cost to maintain the federal debt?</h4>
    <p>{sampleCopy}</p>
    <Accordion title={sixthSectionAccordionTitle}>
      <p>
        While the Department of the Treasury prints actual dollars, “printing money” is also a term
        that is sometimes used to describe a means of monetary policy, which is conducted by the
        Federal Reserve.
      </p>
      <p>
        Monetary policy involves controlling the supply of money and the cost of
        borrowing. The Federal Reserve uses monetary policy to promote maximum employment, stable
        prices, and moderate long-term interest rates on the behalf of the Congress. The federal
        government uses fiscal policy, or the control of taxation and government spending, to
        promote economic activity.
      </p>
    </Accordion>
    <h4>How have the interest rates on the federal debt changed?</h4>
    <p>{sampleCopy}</p>
    <div
      style={{
        height: 500,
        margin: '32px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        backgroundColor: '#555'
      }}
    >
      Last graph
    </div>
  </>
);

const NationalDebtSeventhSection = () => (
  <>
    <p>{sampleCopy}</p>
    <img src={sampleImg} alt="placeholder alt text" />
    <div>more</div>
    <img src={sampleImg} alt="placeholder alt text" />
    <div>images</div>
  </>
);

const nationalDebtSections = [
  {
    index: 0,
    id: nationalDebtSectionIds[0],
    title: 'What are key takeaways of the national debt?',
    component: <NationalDebtFirstSection />
  },
  {
    index: 1,
    id: nationalDebtSectionIds[1],
    title: 'Should I care about the national debt?',
    component: <NationalDebtSecondSection />
  },
  {
    index: 2,
    id: nationalDebtSectionIds[2],
    title: 'What is a brief overview of the national debt?',
    component: <NationalDebtThirdSection />
  },
  {
    index: 3,
    id: nationalDebtSectionIds[3],
    title: 'How has the national debt changed over time?',
    component: <NationalDebtFourthSection sectionId={nationalDebtSectionIds[3]} />
  },
  {
    index: 4,
    id: nationalDebtSectionIds[4],
    title: 'What\'s the breakdown of the federal debt?',
    component: <NationalDebtFifthSection sectionId={nationalDebtSectionIds[4]} />
  },
  {
    index: 5,
    id: nationalDebtSectionIds[5],
    title: 'How\'s the federal debt financed?',
    component: <NationalDebtSixthSection />
  },
  {
    index: 6,
    id: nationalDebtSectionIds[6],
    title: 'What\'s next?',
    component: <NationalDebtSeventhSection />
  },
]

export default nationalDebtSections;
