import React, { useState, useEffect, Fragment, useCallback } from "react"
import { apiPrefix, basicFetch } from "../../../../../utils/api-utils"
import CustomLink from "../../../../../components/links/custom-link/custom-link"
import ChartContainer from "../../../explainer-components/chart-container/chart-container"
import {
  footerStyle,
  headerContainer,
  headerStyle,
  subHeader,
  chartsContainer,
  percentOrDollarContainer,
  descContainer,
  chartToggle,
  toggleButton,
  loadingIcon,
  barContainer,
  barContainerInvisible,
  otherContainer,
  otherContainerInvisible,
  active
} from "./how-much-does-the-govt-spend.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"
import { useWindowSize } from "../../../../../hooks/windowResize"
import moment from "moment"
import useGAEventTracking from "../../../../../hooks/useGAEventTracking";
import Analytics from "../../../../../utils/analytics/analytics";
import {getShortForm} from "../../../../../utils/rounding-utils";
import {ToggleSwitch} from "./chart-toggle-switch";
import {getDateWithoutOffset} from "../../../explainer-helpers/explainer-helpers";
import { keyframes } from "styled-components";
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const breakpoint = {
  desktop: 1015,
  tablet: 600,
}

const grow = (width) => keyframes`
  0% {
    width: 0;
    height: 2.5rem;
  }
  100% {
    width: ${width}%;
    height: 2.5rem;
  }`;

const GrowDivBar = styled.div`
    animation: ${props => props.animateTime}s ${props => props.animate && grow(props.percent * (props.isMobile ? 1 : 2))};
    animation-timing-function: ease-in;
    background: #00766C;
    width: ${props => props.percent * (props.isMobile ? 1 : 2)}%;
    margin-right: 10px;
    height: 40px;
  `


const HowMuchDoesTheGovtSpend = () => {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedChartView, setSelectedChartView] = useState("category")
  const [percentDollarToggleChecked, setPercentDollarToggleChecked] = useState(
    false
  )
  const [isMobile, setIsMobile] = useState(true)
  const [width, height] = useWindowSize()
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date())
  const [fiscalYear, setFiscalYear] = useState('');
  const [animateBars, setAnimateBars] = useState(false);
  const [hasAgencyTriggered, setHasAgencyTriggered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const {getGAEvent} = useGAEventTracking(null, "Spending");

  const handleClick = (eventNumber) =>{
    const gaEvent = getGAEvent(eventNumber);
    Analytics.event({
      category: gaEvent?.eventCategory?.replace("Fiscal Data - ", ""),
      action: gaEvent?.eventAction,
      label: gaEvent?.eventLabel,
    });
  }

  const styleSwitch = () => {
    const switchHandle = document.querySelector("div.react-switch-handle")
    const backgroundWithOpacity = document.querySelector("div.react-switch-bg")
    if (switchHandle) {
      switchHandle.style.outline = "2px solid #00766c"
    }
    if (backgroundWithOpacity) {
      backgroundWithOpacity.style.setProperty("opacity", "0.25 ", "important")
    }
  }
  const getChartData = () => {
    Promise.all([
      basicFetch(
        apiPrefix + 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F' +
        '&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19'
      ),
      basicFetch(
        apiPrefix + 'v1/accounting/mts/mts_table_5?filter=data_type_cd:eq:T,' +
        'sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30'
      ),
    ]).then(result => {
      setChartData({
        category: result[0],
        agency: result[1],
      })
      setLoading(false)
    })
  }
  useEffect(() => {
    getChartData()
  }, [])
  useEffect(() => {
    if (!loading) {
      styleSwitch()
    }
  }, [loading])

  useEffect(() => {
    if (window.innerWidth < breakpoint.desktop) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [width, height])

  useEffect(() => {
    if (chartData) {
      const dataItems = chartData.category.data;
      const dates = dataItems.map(item => moment(item.record_date));
      const fiscalYears = dataItems.map(item => moment(item.record_fiscal_year));
      const maxDate = moment.max(dates);
      const upToDateFiscalYear = moment.max(fiscalYears);
      const updatedDate = getDateWithoutOffset(maxDate);
      setLastUpdatedDate(updatedDate);
      setFiscalYear(upToDateFiscalYear.year());
    }
  }, [selectedChartView, chartData])

  const mts =
    <CustomLink
      url="/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government"
      eventNumber="15"
      id="Monthly Treasury Statement"
    >
      Monthly Treasury Statement (MTS)
    </CustomLink>;

  const footer = (
    <div className={footerStyle}>
      Please note: Values displayed are outlays, which is money that is
      actually paid out by the government. Other sources, such as
      <CustomLink url={'https://www.usaspending.gov/'}> USAspending</CustomLink>, may display spending as obligations, which is
      money that is promised to be paid, but may not yet be delivered.
      <p>
        Visit the {mts} dataset to explore
        and download this data.
      </p>
    </div>
  );

  const header = (
    <div className={headerContainer}>
      <div className={headerStyle}>
        U.S. Government Spending, FYTD {fiscalYear}
      </div>
      <div className={subHeader}>Top 10 Spending by Category and Agency</div>
    </div>
  );

  const sortField =
    selectedChartView === "category"
      ? "current_fytd_rcpt_outly_amt"
      : "current_fytd_net_outly_amt";

  let sortedItems =
    chartData &&
    chartData[selectedChartView]?.data.sort((a, b) => {
      return b[sortField] - a[sortField]
    });

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '-30% 0% -70% 0%',
  });

  useEffect(() => {
    if (inView) {
      setAnimateBars(true);
      setScrolled(true);
    }
  }, [inView])



  const total = (sortedItems || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem
    }, 0);

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round((parseInt(item[sortField], 10) / total) * 100),
      dollarAmount: parseInt(item[sortField]),
    }
  });

  const firstTen = sortedItems?.slice(0, 10);
  const other = sortedItems?.slice(10);

  const otherTotal = (other || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem
    }, 0)
  const otherPercentage = Math.round((otherTotal / total) * 100);

  const animationEndHandler = useCallback(() => {
    setAnimateBars(false);
    setAnimationComplete(true);
  }, []);

  return (
    <ChartContainer
      customContainerStyles={{
        flexDirection: "column",
        marginLeft: "0px",
        maxWidth: "100%",
        paddingLeft: "0px",
      }}
      customFooterStyles={{ paddingLeft: "32px" }}
      customSpacing={{
        marginBottom: "32px",
        paddingLeft: "0px",
      }}
      customHeaderStyles={{
        marginTop: "0px",
        justifyContent: "flex-start",
      }}
      header={header}
      footer={footer}
      date={lastUpdatedDate}
      customTestId="spending-bar-chart"
      altText="Horizontal bar graph comparing government spending by category or agency from largest to smallest, by percentage or dollar value"

    >
      {loading ? (
        <div className={loadingIcon}>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      ) : (
        <Fragment>
          {" "}
          <div className={chartToggle}>
            <button
              className={toggleButton}
              id="spending-categories-toggle"
              style={{
                borderBottomLeftRadius: "4px",
                borderTopLeftRadius: "4px",
                color: selectedChartView === "category" ? "#f1f1f1" : "#00766C",
                background:
                  selectedChartView === "category" ? "#00766C" : "#f1f1f1",
                borderRight: "none",
              }}
              onClick={() => {
                setSelectedChartView("category");
                handleClick("12");
                if (animateBars) {
                  setAnimateBars(false);
                }
              }}
              data-testid="toggle-button-category"
            >
              <span
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: selectedChartView === "agency" ? "inherit" : "#FFFFFF",
                  fontWeight: 600
                }}
              >
                Category
              </span>
            </button>
            <button
              className={toggleButton}
              id="spending-categories-toggle"
              style={{
                borderBottomRightRadius: "4px",
                borderTopRightRadius: "4px",
                color: selectedChartView === "agency" ? "#f1f1f1" : "#00766C",
                background:
                  selectedChartView === "agency" ? "#00766C" : "#f1f1f1",
              }}
              onClick={() => {
                setSelectedChartView("agency");
                handleClick("32");
                if (!hasAgencyTriggered) {
                  setAnimateBars(true);
                  setHasAgencyTriggered(true);
                  setAnimationComplete(false);
                }
              }}
              data-testid="toggle-button-agency"
            >
              <span
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: selectedChartView === "agency" ? "#FFFFFF" : "inherit",
                  fontWeight: 600
                }}
              >
                Agency
              </span>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontWeight: !percentDollarToggleChecked ? "600" : "inherit",
                marginRight: "4px",
                color: !percentDollarToggleChecked ? "#00766C" : "#666",
                minWidth: "80px",
                fontSize: "14px",
              }}
            >
              Percentage
            </span>
            <ToggleSwitch
              checked={percentDollarToggleChecked}
              handleChange={e => {
                setPercentDollarToggleChecked(e)
                handleClick(e ? "33" : "13");
                if (animateBars) {
                  setAnimateBars(false);
                }
              }}
              customStyles={{
                onColor: "#00766C",
                offColor: "#00766C",
              }}
              percentDollarToggleChecked={percentDollarToggleChecked}
              setPercentDollarToggleChecked={setPercentDollarToggleChecked}
            />
            <span
              style={{
                fontWeight: percentDollarToggleChecked ? "600" : "inherit",
                marginLeft: "4px",
                color: percentDollarToggleChecked ? "#00766C" : "#666",
                marginBottom: "24px",
                minWidth: "80px",
                fontSize: "14px",
              }}
            >
              Dollars
            </span>
          </div>
          <div className={scrolled ? barContainer : barContainerInvisible} data-testid="barContainer" ref={ref}>
            <div className={animationComplete && active}>
              {firstTen?.map((item, i) => {
                return (
                  <div className={chartsContainer} key={i}>
                    <GrowDivBar
                      percent={item.percentage}
                      animateTime={0.6}
                      animate={animateBars}
                      onAnimationEnd={animationEndHandler}
                      isMobile={isMobile}
                    />
                    <div
                      className={percentOrDollarContainer}
                      style={{
                        marginRight: item.percentage > 20 ? "0px" : "8px",
                      }}
                    >
                      {percentDollarToggleChecked ?
                        `$${getShortForm(item.dollarAmount)}` : `${item.percentage} %`}
                    </div>
                    <div
                      className={descContainer}
                      data-testid="label"
                    >
                      {item.classification_desc?.replace("Total--", "")}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={scrolled ? otherContainer : otherContainerInvisible}>
            <div className={animationComplete && active}>
              <div className={chartsContainer} key={otherPercentage}>
                <GrowDivBar
                  percent={otherPercentage}
                  animateTime={0.6}
                  animate={animateBars}
                  isMobile={isMobile}
                />
                <div className={percentOrDollarContainer}>
                  {percentDollarToggleChecked
                    ? `$${getShortForm(otherTotal)}`
                    : `${otherPercentage} %`}
                </div>
                <div
                  className={descContainer}
                >
                  Other
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </ChartContainer>
  )
}

export default HowMuchDoesTheGovtSpend;
