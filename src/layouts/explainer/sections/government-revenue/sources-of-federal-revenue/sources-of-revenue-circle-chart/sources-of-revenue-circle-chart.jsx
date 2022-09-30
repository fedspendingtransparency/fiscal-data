import React, { useEffect, useRef, useState } from "react"
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import { CirclePacking } from '@nivo/circle-packing';
import {
  totalRevenueDataPill,
  dataContent,
  chartSize,
} from "./sources-of-revenue-circle-chart.module.scss";
import { withWindowSize } from "react-fns";
import {breakpointLg, fontSize_12} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";
import {apiPrefix, basicFetch} from "../../../../../../utils/api-utils";
import {getShortForm} from "../../../../heros/hero-helper";
import {visWithCallout} from "../../../../explainer.module.scss";
import VisualizationCallout
  from "../../../../../../components/visualization-callout/visualization-callout";
import {revenueExplainerPrimary} from "../../revenue.module.scss";
import {
  opacityValue,
  title,
  subTitle,
  footer,
  dataHeader
} from "./sources-of-revenue-circle-chart-helper";

import LabelComponent from "./circle-chart-label";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {getDateWithoutTimeZoneAdjust} from "../../../../../../utils/date-utils";

const focusDelay = 1000;
const SourcesOfRevenueCircleChart = ({ width }) => {
  const defaultCategory = {
    name: "Individual Income Taxes",
    color: "rgb(10, 47, 90)",
    location: 0
  };

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [fiscalYear, setFiscalYear] = useState(0);
  const [recordDate, setRecordDate] = useState(new Date());

  const [categoryName, setCategoryName] = useState(defaultCategory.name);
  const [categoryRevenueAmount, setCategoryRevenueAmount] = useState(0);
  const [categoryRevenuePercent, setCategoryRevenuePercent] = useState(0);

  const [combinedIncomeAmount, setCombinedIncomeAmount] = useState(0);
  const [combinedIncomePercent, setCombinedIncomePercent] = useState(0);

  const [chartData, setChartData] = useState({});

  const [individualIncomeColor, setIndividualIncomeColor] = useState(defaultCategory.color);
  const [socialSecurityColor, setSocialSecurityColor] = useState("rgb(235, 81, 96, 0.8)");
  const [corporateIncomeColor, setCorporateIncomeColor] = useState("rgb(193, 63, 119, 0.8)");
  const [miscIncomeColor, setMiscIncomeColor] = useState("rgb(255, 119, 62, 0.8)");
  const [exciseTaxesColor, setExciseTaxesColor] = useState("rgb(136, 60, 127, 0.8)");
  const [customsDutiesColor, setCustomsDutiesColor] = useState("rgb(255, 166, 0, 0.8)");
  const [estateTaxesColor, setEstateTaxesColor] = useState("rgb(75, 57, 116, 0.8)");

  const [chartAltText, setChartAltText] = useState("");
  const [elementToFocus, setElementToFocus] = useState(null);
  useEffect(() => {
    const url =
      'v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1';
    basicFetch(`${apiPrefix}${url}`)
      .then((res) => {
        if(res.data[0]) {
          setFiscalYear(res.data[0].record_fiscal_year);
          setTotalRevenue(res.data[0]?.current_fytd_rcpt_outly_amt);
        }
    })
  }, [])

  useEffect(() => {
    const url =
      'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:in:(1.1,1.2)'+
      '&sort=-record_date&page[size]=2';
    basicFetch(`${apiPrefix}${url}`)
      .then((res) => {
        if(res.data[0] && res.data[1]) {
          const income = Number(res.data[0]?.current_fytd_rcpt_outly_amt) +
            Number(res.data[1].current_fytd_rcpt_outly_amt);
          setCombinedIncomeAmount(income);
          setCombinedIncomePercent(combinedIncomeAmount / totalRevenue * 100);
        }
      })
  }, [
    totalRevenue,
    combinedIncomeAmount
  ])

  useEffect(() => {
    const url= 'v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG&'+
      'sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=10';
    basicFetch(`${apiPrefix}${url}`)
      .then((res) => {
        if(res.data[0]) {

          setRecordDate(getDateWithoutTimeZoneAdjust(new Date(res.data[0].record_date)));

          const data = [];
          let totalRev = 0;
          const getDataValue = (lineNbr) =>
            res.data.filter((record) => {return record.line_code_nbr === lineNbr});
          let nodeValue = getDataValue("20")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const incomeTax = {
            "id": "Individual Income Taxes",
            "color": individualIncomeColor,
            "value": nodeValue,
          }

          nodeValue = (Number(getDataValue("50")[0]?.current_fytd_rcpt_outly_amt) +
                      Number(getDataValue("60")[0]?.current_fytd_rcpt_outly_amt) +
                      Number(getDataValue("70")[0]?.current_fytd_rcpt_outly_amt)).toString();
          totalRev += Number(nodeValue);
          const socialSecurityMedicare = {
            "id": "Social Security and Medicare Taxes",
            "color": socialSecurityColor,
            "value": nodeValue,
          };

          nodeValue = getDataValue("30")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const corporateIncome = {
            "id": "Corporate Income Taxes",
            "color": corporateIncomeColor,
            "value": nodeValue,
          };

          nodeValue = getDataValue("110")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const misc = {
            "id": "Miscellaneous Income",
            "color": miscIncomeColor,
            "value": nodeValue,
          };

          nodeValue = getDataValue("100")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const customsDuties = {
            "id": "Customs Duties",
            "color": customsDutiesColor,
            "value": nodeValue,
          };

          nodeValue = getDataValue("90")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const estateTax =  {
            "id": "Estate & Gift Taxes",
            "color": estateTaxesColor,
            "value": nodeValue,
          };

          nodeValue = getDataValue("80")[0]?.current_fytd_rcpt_outly_amt;
          totalRev += Number(nodeValue);
          const exciseTax = {
            "id": "Excise Taxes",
            "value": nodeValue,
            "color": exciseTaxesColor
          };

          if(categoryRevenuePercent === 0 && categoryRevenueAmount === 0) {
            setCategoryRevenuePercent(Number(incomeTax.value) / totalRev * 100);
            setCategoryRevenueAmount(Number(incomeTax.value));
          }

          data.push({
            ...incomeTax,
            "percent": Number(incomeTax.value) / totalRev,
          });

          data.push({
            ...corporateIncome,
            "percent": Number(corporateIncome.value) / totalRev,
          });
          data.push({
            ...socialSecurityMedicare,
            "percent": Number(socialSecurityMedicare.value) / totalRev,
          });
          data.push({
            ...misc,
            "percent": Number(misc.value) / totalRev,
          });
          data.push({
            ...customsDuties,
            "percent": Number(customsDuties.value) / totalRev,
          });
          data.push({
            ...estateTax,
            "percent": Number(estateTax.value) / totalRev,
          });
          data.push({
            ...exciseTax,
            "percent": Number(exciseTax.value) / totalRev,
          });

          setChartData({children: data});

          if(chartAltText === ""){
            const altTextData = data.slice().sort((a,b) => b.value - a.value);
            const altText = `A cluster of seven different colored and sized circles representing
            the different U.S. government revenue source categories and how much each source
            contributes to the overall revenue respectively. ${altTextData[0].id} is the largest
            circle, followed by ${altTextData[1].id} and ${altTextData[2].id}. Smaller circles
            (in descending order) represent ${altTextData[3].id}, ${altTextData[4].id},
             ${altTextData[5].id}, and ${altTextData[6].id}.`;
            setChartAltText(altText);
          }
        }
      })
  }, [
    individualIncomeColor,
    socialSecurityColor,
    corporateIncomeColor,
    miscIncomeColor,
    customsDutiesColor,
    estateTaxesColor,
    exciseTaxesColor
  ]);

  const chartWrap = useRef(null);

  useEffect(() => {

    const handleOutsideClick = (event) => {
      if (chartWrap.current && !chartWrap.current.contains(event.target)) {
        HandleChartMouseLeave();
      }
    }
    // Adding tap/click event listener
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [chartWrap]);


  useEffect(() => {
    if (elementToFocus) {
      setTimeout(() => {
        const element = document.getElementById(elementToFocus);
        element?.focus();
      }, focusDelay);
    }
  }, [elementToFocus])

  const colorMap = {
    'Individual Income Taxes': {
      set:(color) => setIndividualIncomeColor(color),
      color: individualIncomeColor
    },
    'Corporate Income Taxes': {
      set:(color) => setCorporateIncomeColor(color),
      color: corporateIncomeColor
    },
    'Social Security and Medicare Taxes': {
      set:(color) => setSocialSecurityColor(color),
      color: socialSecurityColor
    },
    'Miscellaneous Income': {
      set:(color) => setMiscIncomeColor(color),
      color: miscIncomeColor
    },
    'Customs Duties': {
      set:(color) => setCustomsDutiesColor(color),
      color: customsDutiesColor
    },
    'Estate & Gift Taxes': {
      set:(color) => setEstateTaxesColor(color),
      color: estateTaxesColor
    },
    'Excise Taxes': {
      set:(color) => setExciseTaxesColor(color),
      color: exciseTaxesColor
    }
  }

  const increaseOpacity = (id, color) => {
    if(color.includes(opacityValue)) {
      const newColor = color.replace(opacityValue, '');
      colorMap[id].set(newColor);
    }
  }

  const decreaseOpacity = (id, color) => {
    if(!color.includes(opacityValue)) {
      const newColor = color.replace(')', opacityValue+')');
      colorMap[id].set(newColor);
    }
  }
  const HandleLabelClick = (node, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      const target = document.querySelector(`[cx="${node.x}"]`);
      const circleEvent = new e.nativeEvent.constructor(e.nativeEvent.type, e.nativeEvent);
      target.dispatchEvent(circleEvent);
    }
  }
  const HandleMouseEnter = (node, e, elementId) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if(node.id !== categoryName) {
      decreaseOpacity(categoryName, colorMap[categoryName].color);
      increaseOpacity(node.id, node.color);
      setCategoryName(node.id);
      setCategoryRevenueAmount(node.value);
      setCategoryRevenuePercent(node.percentage);
      // set focus on next element after this series of re-renders
      setElementToFocus(elementId)
    }
  };

  const HandleChartMouseLeave = () => {
    if(chartData !== {}) {
      Object.keys(colorMap).forEach(colorCategory => {
        if (colorCategory !== defaultCategory.name) {
          decreaseOpacity(colorCategory, colorMap[colorCategory].color);
        }
      })
      setIndividualIncomeColor(defaultCategory.color);
      setCategoryName(defaultCategory.name);
      if (chartData && chartData.children) {
        setCategoryRevenueAmount(chartData.children[defaultCategory.location].value);
        setCategoryRevenuePercent(chartData.children[defaultCategory.location].percent * 100);
      }
    }
  }

  return (
    <>
      <div className={visWithCallout}>
        <ChartContainer
          title={title +  fiscalYear}
          subTitle={subTitle}
          header={dataHeader(categoryName, categoryRevenueAmount, categoryRevenuePercent)}
          footer={footer}
          altText={chartAltText}
          date={recordDate}
          customTitleStyles={width < pxToNumber(breakpointLg) ? {fontSize: fontSize_12}: {}}
          customSubTitleStyles={width < pxToNumber(breakpointLg) ? {fontSize: fontSize_12}: {}}
        >
      {chartData !== {} ? (
          <div className={dataContent} >
            <div
              role="presentation"
              className={chartSize}
              onMouseLeave={HandleChartMouseLeave}
              onClick={HandleChartMouseLeave}
              ref={chartWrap}
            >
              <CirclePacking
                data={chartData}
                colors={{datum: "data.color"}}
                margin={{top: 25, right: 10, bottom:25, left:10}}
                height={ width < pxToNumber(breakpointLg) ? 350 : 500 }
                width={ width < pxToNumber(breakpointLg) ? 350 : 500 }
                colorBy={'id'}
                leavesOnly
                enableLabels={true}
                labelsSkipRadius={0}
                labelComponent={({node, label}) =>
                  <LabelComponent
                    node={node}
                    label={label}
                    width={width}
                    HandleMouseEnter={HandleMouseEnter}
                    HandleClick={HandleLabelClick}
                    HandleMouseLeave={HandleChartMouseLeave}
                  />}
                animate={false}
                onMouseEnter={(node, e) => HandleMouseEnter(node, e)}
                onClick={(node, e) => HandleMouseEnter(node, e)}
              />
            </div>
            <div className={totalRevenueDataPill}>
              Total Revenue: ${getShortForm(totalRevenue.toString(), 2, true)}
            </div>
          </div>
      ) : (
        <div>
          <FontAwesomeIcon icon={faSpinner} spin pulse /> Loading...
        </div>
      )}
        </ChartContainer>
        <VisualizationCallout color={revenueExplainerPrimary}>
          <p>
            In FY {fiscalYear}, the combined contribution
            of individual and corporate income taxes is
            ${getShortForm(combinedIncomeAmount.toString(), 0, true, true)},
            making up {combinedIncomePercent.toFixed()}% of total revenue.
          </p>
        </VisualizationCallout>
      </div>
    </>
  );
}

export default withWindowSize(SourcesOfRevenueCircleChart);
