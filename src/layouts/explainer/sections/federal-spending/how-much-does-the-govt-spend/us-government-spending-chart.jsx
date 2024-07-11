import React, { useState, useEffect, useCallback } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import ChartContainer from '../../../explainer-components/chart-container/chart-container';
import {
  chartsContainer,
  percentOrDollarContainer,
  descContainer,
  loadingIcon,
  barContainer,
  barContainerInvisible,
  otherContainer,
  otherContainerInvisible,
  active,
  barChart,
  dollarsToggleChecked,
  dollarsToggleUnchecked,
  percentToggleChecked,
  percentToggleUnchecked,
  toggleContainer,
  spendingChartContainer,
} from './us-government-spending-chart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { footer, handleGAEventClick, GrowDivBar } from './us-government-spending-chart-helper';
import { getShortForm } from '../../../../../utils/rounding-utils';
import { ToggleSwitch } from './chart-toggle-switch/chart-toggle-switch';
import { getDateWithoutOffset } from '../../../explainer-helpers/explainer-helpers';
import { useInView } from 'react-intersection-observer';
import ChartToggle from '../../../../../components/nivo/chart-toggle/chart-toggle';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import useGAEventTracking from '../../../../../hooks/useGAEventTracking';
import { breakpointLg } from '../../../../../variables.module.scss';

const USGovernmentSpendingChart = ({ width }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChartView, setSelectedChartView] = useState('category');
  const [percentDollarToggleChecked, setPercentDollarToggleChecked] = useState(false);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [fiscalYear, setFiscalYear] = useState('');
  const [animateBars, setAnimateBars] = useState(false);
  const [hasAgencyTriggered, setHasAgencyTriggered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { getGAEvent } = useGAEventTracking(null, 'SpendingExplainer');

  const styleSwitch = () => {
    const switchHandle = document.querySelector('div.react-switch-handle');
    const backgroundWithOpacity = document.querySelector('div.react-switch-bg');
    if (switchHandle) {
      switchHandle.style.outline = '2px solid #00766c';
    }
    if (backgroundWithOpacity) {
      backgroundWithOpacity.style.setProperty('opacity', '0.25 ', 'important');
    }
  };

  const getChartData = () => {
    Promise.all([
      basicFetch(apiPrefix + 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:F&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=19'),
      basicFetch(
        apiPrefix +
          'v1/accounting/mts/mts_table_5?filter=data_type_cd:eq:T,' +
          'sequence_level_nbr:eq:2,line_code_nbr:lte:5690&sort=-record_date,-current_fytd_net_outly_amt&page[size]=30'
      ),
    ]).then(result => {
      setChartData({
        category: result[0],
        agency: result[1],
      });
      setLoading(false);
    });
  };

  useEffect(() => {
    getChartData();
  }, []);

  useEffect(() => {
    if (!loading) {
      styleSwitch();
    }
  }, [loading]);

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
  }, [selectedChartView, chartData]);

  const sortField = selectedChartView === 'category' ? 'current_fytd_rcpt_outly_amt' : 'current_fytd_net_outly_amt';

  let sortedItems =
    chartData &&
    chartData[selectedChartView]?.data.sort((a, b) => {
      return b[sortField] - a[sortField];
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
  }, [inView]);

  const total = (sortedItems || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem;
    }, 0);

  sortedItems = sortedItems?.map(item => {
    return {
      ...item,
      percentage: Math.round((parseInt(item[sortField], 10) / total) * 100),
      dollarAmount: parseInt(item[sortField]),
    };
  });

  const firstTen = sortedItems?.slice(0, 10);
  const other = sortedItems?.slice(10);

  const otherTotal = (other || [])
    .map(item => parseInt(item[sortField], 10))
    ?.reduce((item, nextItem) => {
      return item + nextItem;
    }, 0);
  const otherPercentage = Math.round((otherTotal / total) * 100);

  const animationEndHandler = useCallback(() => {
    setAnimateBars(false);
    setAnimationComplete(true);
  }, []);

  const leftButtonConfig = {
    leftTitle: 'Category',
    leftId: 'category',
    leftSelected: selectedChartView === 'category',
  };
  const rightButtonConfig = {
    rightTitle: 'Agency',
    rightId: 'agency',
    rightSelected: selectedChartView === 'agency',
  };

  const toggleClickHandler = selectedChartView => {
    setSelectedChartView(selectedChartView);
    if (selectedChartView === 'category') {
      handleGAEventClick('12', getGAEvent);
      if (animateBars) {
        setAnimateBars(false);
      }
    } else if (selectedChartView === 'agency') {
      handleGAEventClick('32', getGAEvent);
      if (!hasAgencyTriggered) {
        setAnimateBars(true);
        setHasAgencyTriggered(true);
        setAnimationComplete(false);
      }
    }
  };

  const chartToggleHeader = (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '100%' }}>
      <ChartToggle
        leftButtonConfig={leftButtonConfig}
        rightButtonConfig={rightButtonConfig}
        primaryColor="#00766C"
        toggleClickHandler={toggleClickHandler}
        chartId="spending-categories-toggle"
      />
      <div className={toggleContainer}>
        <span className={!percentDollarToggleChecked ? percentToggleChecked : percentToggleUnchecked}>Percentage</span>
        <ToggleSwitch
          checked={percentDollarToggleChecked}
          handleChange={e => {
            setPercentDollarToggleChecked(e);
            handleGAEventClick(e ? '33' : '13', getGAEvent);
            if (animateBars) {
              setAnimateBars(false);
            }
          }}
          customStyles={{
            onColor: '#00766C',
            offColor: '#00766C',
          }}
          percentDollarToggleChecked={percentDollarToggleChecked}
          setPercentDollarToggleChecked={setPercentDollarToggleChecked}
        />
        <span className={percentDollarToggleChecked ? dollarsToggleChecked : dollarsToggleUnchecked}>Dollars</span>
      </div>
    </div>
  );

  return (
    <div className={spendingChartContainer}>
      <ChartContainer
        title={`U.S. Government Spending, FYTD ${fiscalYear}`}
        subTitle="Top 10 Spending by Category and Agency"
        header={chartToggleHeader}
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
          <div className={barChart}>
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
                        isMobile={width < pxToNumber(breakpointLg)}
                      />
                      <div
                        className={percentOrDollarContainer}
                        style={{
                          marginRight: item.percentage > 20 ? '0px' : '8px',
                        }}
                      >
                        {percentDollarToggleChecked ? `$${getShortForm(item.dollarAmount)}` : `${item.percentage} %`}
                      </div>
                      <div className={descContainer} data-testid="label">
                        {item.classification_desc?.replace('Total--', '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={scrolled ? otherContainer : otherContainerInvisible}>
              <div className={animationComplete && active}>
                <div className={chartsContainer} key={otherPercentage}>
                  <GrowDivBar percent={otherPercentage} animateTime={0.6} animate={animateBars} isMobile={width < pxToNumber(breakpointLg)} />
                  <div className={percentOrDollarContainer}>
                    {percentDollarToggleChecked ? `$${getShortForm(otherTotal)}` : `${otherPercentage} %`}
                  </div>
                  <div className={descContainer}>Other</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ChartContainer>
    </div>
  );
};

export default withWindowSize(USGovernmentSpendingChart);
