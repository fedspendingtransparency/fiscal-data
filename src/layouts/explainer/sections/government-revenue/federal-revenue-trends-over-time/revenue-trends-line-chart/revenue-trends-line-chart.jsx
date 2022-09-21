import React, {useEffect, useState} from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {breakpointLg, fontSize_10, fontSize_14} from "../../../../../../variables.module.scss";
import {withWindowSize} from "react-fns";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./revenue-trends-line-chart.module.scss";
import { Line } from '@nivo/line';
import {fontSize_16} from "../../../../explainer.module.scss";
import {apiPrefix, basicFetch} from "../../../../../../utils/api-utils";
import {adjustDataForInflation} from "../../../../../../helpers/inflation-adjust/inflation-adjust";
import {colors, sum} from "./revenue-trends-line-chart-helpers";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";


const RevenueTrendsLineChart = ({ width, cpiDataByYear }) => {


  const [chartData, setChartData] = useState([]);
  const [lastChartYear, setLastChartYear] = useState(0);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());
  const [chartYears, setChartYears] = useState([]);

  useEffect(() => {
    const endPointURL = 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,'
      + 'record_calendar_month:eq:09&sort=-record_date';
    basicFetch(`${apiPrefix}${endPointURL}`)
      .then((res) => {
        if (res.data) {
          setLastChartYear(res.data[0].record_fiscal_year);
          const chartDate = new Date(res.data[0].record_date);
          setLastUpdatedDate(getDateWithoutTimeZoneAdjust(chartDate));
          const completeData = [];
          const filteredData = [];
          res.data = adjustDataForInflation(res.data, "current_fytd_rcpt_outly_amt",
            "record_date", cpiDataByYear);
          const incomeTax = {
            name: "Individual Income Taxes",
            data: res.data.filter((record) => { return record.line_code_nbr === "20"})
          };
          filteredData.push(incomeTax);
          const combinedSocSecData = [];
          const socialSecurityData = res.data.filter((record) => {
            return record.line_code_nbr === "50"
              || record.line_code_nbr === "60" || record.line_code_nbr === "70"});
          const socSecYears = [...new Set(socialSecurityData.map(entry => entry.record_fiscal_year))];
          setChartYears(socSecYears);
          socSecYears.forEach((year) => {
            const forAGivenYear = socialSecurityData.filter((entry) => entry.record_fiscal_year === year);
            const sumOfRevenueForYear = forAGivenYear.map(element => element.current_fytd_rcpt_outly_amt).reduce(sum);
            combinedSocSecData.push({
              record_fiscal_year: year,
              current_fytd_rcpt_outly_amt: sumOfRevenueForYear
            })
          })
          const socialSecurityMedicare = {
            name: "Social Security and Medicare Taxes",
            data: combinedSocSecData
          };
          filteredData.push(socialSecurityMedicare);
          const corpTax = {
            name: "Corporate Income Taxes",
            data: res.data.filter((record) => { return record.line_code_nbr === "30"})
          };
          filteredData.push(corpTax);
          const misc = {
            name: "Miscellaneous Income",
            data: res.data.filter((record) => { return record.line_code_nbr === "110"})
          };
          filteredData.push(misc);
          const exciseTax = {
            name: "Excise Taxes",
            data: res.data.filter((record) => { return record.line_code_nbr === "80"})
          };
          filteredData.push(exciseTax);
          const customsDuties = {
            name: "Customs Duties",
            data: res.data.filter((record) => { return record.line_code_nbr === "100"})
          };
          filteredData.push(customsDuties);
          const estateTax = {
            name: "Estate & Gift Taxes",
            data: res.data.filter((record) => { return record.line_code_nbr === "90"})
          };
          filteredData.push(estateTax);
          filteredData.forEach((category) => {
              const dataObject = {
                "id": category.name,
                "color": colors.find((entry) => category.name === entry.name).value,
                "data": category.data.map((entry) =>
                { return {"x": entry.record_fiscal_year, "y": parseFloat((entry.current_fytd_rcpt_outly_amt / 1000000000000).toFixed(2))} })
              }
              completeData.push(dataObject);
          });
          setChartData(completeData);
        }
      });
  }, [])

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
      download this data. The inflation data is sourced from the {blsLink}.
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

  useEffect(() => {
    applyChartScaling()
  }, [])

  return (
    <>
      { chartData !== [] ? (
        <div data-testid={'revenueTrendsLineChart'} className={styles.container}>
          <ChartContainer
            title={`Federal Revenue Trends Over Time, FY 2015-${lastChartYear}`}
            subTitle={`Inflation Adjusted - ${lastChartYear} Dollars`}
            altText={`Area chart showing federal revenue totals by revenue category from 2015 - ${lastChartYear}`}
            footer={footer}
            date={lastUpdatedDate}
            customFooterSpacing={ width < pxToNumber(breakpointLg) ? {fontSize: fontSize_14}: {} }
            customTitleStyles={ width < pxToNumber(breakpointLg) ? {fontSize: fontSize_16, color: '#666666'}: {} }
            customSubTitleStyles={ width < pxToNumber(breakpointLg) ? {fontSize: fontSize_14}: {} }
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
                  max: lastChartYear
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
                  tickValues: chartYears
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
