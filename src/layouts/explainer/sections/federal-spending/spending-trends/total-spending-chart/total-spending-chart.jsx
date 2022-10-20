import React, { useEffect, useState } from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import { Line } from "@nivo/line";
import { pxToNumber } from "../../../../../../helpers/styles-helper/styles-helper";
import {
  breakpointLg,
  fontSize_10,
  fontSize_14,
} from "../../../../../../variables.module.scss";
import { withWindowSize } from "react-fns";
import {
  chartCopy,
  dataHeader,
  chartConfigs,
  getMarkers,
} from "./total-spending-chart-helper";
import { visWithCallout } from "../../../../explainer.module.scss";
import VisualizationCallout from "../../../../../../components/visualization-callout/visualization-callout";
import { spendingExplainerPrimary } from "../../federal-spending.module.scss";
import { lineChart, container } from "./total-spending-chart.module.scss";
import { apiPrefix, basicFetch } from "../../../../../../utils/api-utils"
import numeral from "numeral"
import simplifyNumber from "../../../../../../helpers/simplify-number/simplifyNumber";
import { adjustDataForInflation } from "../../../../../../helpers/inflation-adjust/inflation-adjust";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const callOutDataEndPoint =
  apiPrefix + "v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1";

const chartDataEndPoint = apiPrefix + "v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date";

const gdpEndPoint = "https://apps.bea.gov/api/data/?UserID=F9C35FFF-7425-45B0-B988-9F10E3263E9E&method=GETDATA&datasetname=NIPA&TableName=T10105&frequency=Q&year=X&ResultFormat=JSON";

const TotalSpendingChart = ({ width, cpiDataByYear }) => {
  const [spendingChartData, setSpendingChartData] = useState([]);
  const [gdpChartData, setGdpChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [minYear, setMinYear] = useState(2015);
  const [maxYear, setMaxYear] = useState(0);
  const [maxAmount, setMaxAmount] = useState(0);
  const [callOutYear, setCallOutYear] = useState("");
  const [firstRatio, setFirstRatio] = useState("");
  const [lastRatio, setlastRatio] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState(new Date());


  const data = [
    {
      id: "GDP",
      color: "#666666",
      data: gdpChartData,
    },
    {
      id: "Total Spending",
      color: "#666666",
      data: spendingChartData
    },
  ];

  const applyTextScaling = () => {
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      if (width < pxToNumber(breakpointLg)) {
        const containerWidth = document.querySelector(
          '[data-testid="chartParent"]'
        ).offsetWidth;
        const ratio = 550 / containerWidth;
        const textElements = document.querySelectorAll(
          '[data-testid="chartParent"] text'
        );
        [...textElements].forEach(text => {
          text.style.fontSize = `${parseFloat(fontSize_10) * ratio}rem`;
        });
      }
    }
  };

  const applyChartScaling = () => {
    // rewrite some element attribs after render to ensure Chart scales with container
    // which doesn't seem to happen naturally when nivo has a flex container
    const svgChart = document.querySelector('[data-testid="chartParent"] svg');
    if (svgChart) {
      svgChart.setAttribute("viewBox", "0 0 550 490");
      svgChart.setAttribute("height", "100%");
      svgChart.setAttribute("width", "100%");
    }
  };

  useEffect(() => {
    basicFetch(callOutDataEndPoint).then((res) => {
      if (res.data) {
        setCallOutYear(res.data[0].record_fiscal_year);
      }
    })

  }, []);

  useEffect(() => {
    basicFetch(chartDataEndPoint)
      .then((res) => {
        if (res.data) {
          let spendingMinYear;
          let spendingMaxYear;
          let maxAmount;
          let finalSpendingChartData = [];
          let lastUpdatedDateSpending;
          res.data = adjustDataForInflation(res.data, "current_fytd_net_outly_amt", "record_date", cpiDataByYear);
          res.data.map((t) => {
            finalSpendingChartData.push({
              x: parseInt(t.record_fiscal_year),
              y: parseFloat(simplifyNumber(t.current_fytd_net_outly_amt, false).slice(0, -2)),
              actual: t.current_fytd_net_outly_amt
            })

          })

          lastUpdatedDateSpending = new Date(res.data[res.data.length - 1].record_date + " 00:00:00");
          setLastUpdatedDate(lastUpdatedDateSpending);
          spendingMinYear = finalSpendingChartData[0].x;
          spendingMaxYear = finalSpendingChartData[finalSpendingChartData.length - 1].x;
          let lastUpdatedDateGDP = new Date();
          setMinYear(spendingMinYear);
          setMaxYear(spendingMaxYear);

          setSpendingChartData(finalSpendingChartData);

          //ToDo: This can be moved to a custom Hook, and since GDP data is updated monthly we can think about consuming a flat file via Gatsby     
          basicFetch(gdpEndPoint)
            .then((bea_res) => {
              if (bea_res.BEAAPI.Results.Notes) {
                let extractedDateGDP = bea_res.BEAAPI.Results?.Notes[0]?.NoteText.slice(bea_res.BEAAPI.Results.Notes[0].NoteText.indexOf("LastRevised: "));
                lastUpdatedDateGDP = extractedDateGDP ? new Date(extractedDateGDP) : new Date();
              }
              if (bea_res.BEAAPI.Results.Data) {
                let finalGDPChartData = [];
                let total = 0;
                let count = 0;
                bea_res.BEAAPI.Results.Data
                  .map((entry) => {
                    if (entry.LineDescription === 'Gross domestic product' && parseInt(entry.TimePeriod.slice(0, -2)) >= spendingMinYear - 1) {

                      let quarter = entry.TimePeriod.slice(4);
                      let year = parseInt(entry.TimePeriod.slice(0, -2));
                      let fiscalYear = quarter == "Q4" ? year + 1 : year;
                      let amount = parseInt(String(entry.DataValue.replace(/,/g, '') + '000000'));
                      if (fiscalYear == year) {
                        total += amount;
                      } else {
                        total = amount;
                      }

                      if (quarter == "Q3" && fiscalYear >= 2015) {
                        finalGDPChartData.push({
                          x: fiscalYear,
                          y: total / 4,
                          actual: total / 4,
                          fiscalYear: String(fiscalYear)
                        });

                      }
                    }
                  });

                finalGDPChartData = adjustDataForInflation(finalGDPChartData, "actual", "fiscalYear", cpiDataByYear);

                finalGDPChartData.map((gdp) => {
                  gdp.y = parseFloat(simplifyNumber(gdp.actual, false).slice(0, -2));
                });

                let gdpMaxAmount = finalGDPChartData.reduce((max, gdp) => max > gdp.y ? max : gdp.y);
                let spendingMaxAmount = finalSpendingChartData.reduce((max, spending) => max > spending.y ? max : spending.y);
                setGdpChartData(finalGDPChartData);
                maxAmount = Math.ceil((spendingMaxAmount > gdpMaxAmount ? spendingMaxAmount : gdpMaxAmount) / 5) * 5;
                setMaxAmount(maxAmount);
                setIsLoading(false);
                setFirstRatio(numeral(finalSpendingChartData[0].y / finalGDPChartData[0].y).format("0%"));
                setlastRatio(numeral(finalSpendingChartData[finalSpendingChartData.length - 1].y / finalGDPChartData[finalGDPChartData.length - 1].y).format("0%"));
                applyChartScaling();

              }
            });

        }
      });
  }, []);

  useEffect(() => {
    applyTextScaling();
  }, [width]);

  return (
    <>
      {isLoading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
      {!isLoading && (

        <div className={visWithCallout}>
          <div className={container}>
            <ChartContainer
              title={chartCopy.title}
              subTitle={chartCopy.subtitle}
              footer={chartCopy.footer}
              date={lastUpdatedDate}
              header={dataHeader()}
              altText={chartCopy.altText}
            >
              <div className={lineChart} data-testid={"chartParent"}>
                <Line
                  data={data}
                  layers={chartConfigs.layers}
                  theme={{
                    ...chartConfigs.theme,
                    fontSize:
                      width < pxToNumber(breakpointLg)
                        ? fontSize_10
                        : fontSize_14,
                    marker: {
                      fontSize:
                        width < pxToNumber(breakpointLg)
                          ? fontSize_10
                          : fontSize_14,
                    },
                  }}
                  colors={d => d.color}
                  width={550}
                  height={490}
                  margin={
                    width < pxToNumber(breakpointLg)
                      ? { top: 25, right: 25, bottom: 35, left: 65 }
                      : { top: 25, right: 15, bottom: 45, left: 50 }
                  }
                  enablePoints={true}
                  pointSize={0}
                  enableGridX={false}
                  enableGridY={false}
                  xScale={{
                    type: "linear",
                    min: minYear,
                    max: maxYear,
                  }}
                  yScale={{
                    type: "linear",
                    min: 0,
                    max: maxAmount,
                    stacked: false,
                    reverse: false,
                  }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={chartConfigs.axisBottom}
                  axisLeft={chartConfigs.axisLeft}
                  useMesh={true}
                  isInteractive={true}
                  enableCrosshair={false}
                  crosshairType={"x"}
                  animate={false}
                  tooltip={() => null}
                  markers={getMarkers(width)}
                ></Line>
              </div>
            </ChartContainer>
          </div>
          <VisualizationCallout color={spendingExplainerPrimary}>
            <p>
              Since {callOutYear}, the Spending to GDP ratio has increased from {firstRatio} to {lastRatio}.
            </p>
          </VisualizationCallout>
        </div>
      )}
    </>

  );
};

export default withWindowSize(TotalSpendingChart);
