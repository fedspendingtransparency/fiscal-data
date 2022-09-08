import React from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_12, fontSize_14} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./revenue-trends-line-chart.module.scss";
import {chartData} from "./revenue-trends-line-chart-helpers";
import { Line } from '@nivo/line';


const RevenueTrendsLineChart = ({ width }) => {

  const date = new Date();

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute('viewBox', '0 0 495 388');
      svgChart.setAttribute('height', '100%');
      svgChart.setAttribute('width', '100%');
    }
  };

  const formatCurrency = v => {
    if (parseFloat(v) < 0) {
      return `$${Math.abs(v)} T`;
    }
    else {
      return `$${v} T`;
    }
  };

  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const footer =
    <div>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
      download this data.
      <p>
        Please note: This data visual only includes completed fiscal years.
      </p>
    </div>;

  const chartTheme = {
    fontSize:  width < pxToNumber(breakpointLg) ? fontSize_12 : fontSize_14,
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

  return (
    <>
      { chartData !== [] ? (
        <div data-testid={'revenueTrendsLineChart'} className={styles.container}>
          <ChartContainer
            title={'U.S. Federal Revenue Trends Over Time, FY 2015-2021'}
            altText={'Area chart chowing federal revenue totals by revenue category from 2015 - 2021'}
            footer={footer}
            date={date}
          >
            <div className={styles.lineChart} data-testid={'chartParent'}>
              <Line
                data={chartData}
                width={ 515 }
                height={ 500 }
                margin={{ top: 10, right: 40, bottom: 60, left: 45 }}
                xScale={{ type: 'point' }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
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
                  tickSize: 10,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                axisLeft={{
                  format: formatCurrency,
                  orient: 'left',
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
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
