import React, {useEffect} from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_10, fontSize_14} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./revenue-trends-line-chart.module.scss";
import {chartData} from "./revenue-trends-line-chart-helpers";
import { Line } from '@nivo/line';


const RevenueTrendsLineChart = ({ width }) => {

  const date = new Date();

  // The below const values are for mapping colors to data for when the data gets hooked in

  // const estateColor = '#4b3974';
  // const customsColor = '#ffa600';
  // const exciseColor = '#883c7f';
  // const miscColor = '#ff773e';
  // const corpColor = '#c13f77';
  // const socialSecColor = '#eb5160';
  // const indvColor = '#0a2f5a';

  const blsLink =
    <CustomLink
      url={"https://www.bls.gov/"}
    >
      Bureau of Labor Statistics
    </CustomLink>;

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 480 500');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `$${Math.abs(v)} T`;
    }
    else if (parseFloat(v) > 0){
      return `$${v} T`;
    }
    else {
      return `$${v}`;
    }
  };

  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/receipts-of-the-u-s-government`;
  const footer =
    <div>
      <p>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
      download this data. The inflation data is sourced from the {blsLink}
      </p>
      <p></p>
    </div>;

  const chartTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_10 : fontSize_14,
    fontColor: '#666666',
    axis: {
      domain: {
        line: {
          strokeWidth: 1,
          stroke: '#666666'
        }
      }
    }
  };

  const calcTickSize = (tick) => {
    console.log(tick);
    return 6;
  }

  useEffect(() => {
    applyChartScaling()
  }, [])

  return (
    <>
      { chartData !== [] ? (
        <div data-testid={'revenueTrendsLineChart'} className={styles.container}>
          <ChartContainer
            title={'Federal Revenue Trends Over Time, FY 2015-2021'}
            subTitle={'Inflation Adjusted - 2021 Dollars'}
            altText={'Area chart showing federal revenue totals by revenue category from 2015 - 2021'}
            footer={footer}
            date={date}
          >
            <div className={styles.lineChart} data-testid={'chartParent'}>
              <Line
                data={chartData}
                colors={d => d.color}
                width={ 515 }
                height={ 500 }
                margin={{ top: 10, right: 50, bottom: 60, left: 40 }}
                xScale={{
                  type: 'linear',
                  min: 2015,
                  max: 2021
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 5,
                  stacked: true,
                  reverse: false
                }}
                theme={chartTheme}
                enableArea={true}
                areaOpacity={1}
                enableGridY={false}
                enableGridX={false}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  orient: 'bottom',
                  tickSize: 6,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: 7
                }}
                axisLeft={{
                  format: formatCurrency,
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  tickValues: 6
                }}
                pointSize={0}
                pointLabelYOffset={-12}
                useMesh={true}
                enablePoints={false}
                enableCrosshair={false}
                isInteractive={false}
                animate={true}
              />
              <div className={styles.legendContainer}>
                <div className={styles.legendColumn}>
                  <div className={styles.legendElement}>
                    <div className={styles.estateRect} />
                    <div className={styles.legendText}> Estate & Gift Taxes </div>
                  </div>
                  <div className={styles.legendElement}>
                    <div className={styles.customsRect} />
                    <div className={styles.legendText}> Customs Duties </div>
                  </div>
                  <div className={styles.legendElement}>
                    <div className={styles.exciseRect} />
                    <div className={styles.legendText}> Excise Taxes </div>
                  </div>
                  <div className={styles.legendElement}>
                    <div className={styles.miscRect} />
                    <div className={styles.legendText}> Miscellaneous Income </div>
                  </div>
                </div>
                <div className={styles.legendColumn}>
                  <div className={styles.legendElement}>
                    <div className={styles.corpRect} />
                    <div className={styles.legendText}> Corporate Income Taxes </div>
                  </div>
                  <div className={styles.legendElement}>
                    <div className={styles.socialSecRect} />
                    <div className={styles.legendText}>
                      Social Security and
                      Medicare Taxes
                    </div>
                  </div>
                  <div className={styles.legendElement}>
                    <div className={styles.indvRect} />
                    <div className={styles.legendText}>
                      Individual Income
                      Taxes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )
      }
    </>
  )
};

export default withWindowSize(RevenueTrendsLineChart);
