import React, { useState } from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import { CirclePacking } from '@nivo/circle-packing';
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {
  dataHeaderContainer,
  header,
  dataLabels,
  headerTitle,
  subHeader,
  category,
  footerContainer,
  totalRevenueDataPill,
  dataContent,
  chartSize
} from "./sources-of-revenue-circle-chart.module.scss";
import { withWindowSize } from "react-fns";
import {breakpointLg, fontSize_12, semiBoldWeight} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";

const SourcesOfRevenueCircleChart = ({ width }) => {
  const [categoryName, setCategoryName] = useState("Individual Income Taxes");
  const [revenueAmount, setRevenueAmount] = useState(85);
  const [defaultRevenueAmount, setDefaultRevenueAmount] = useState(85);
  const [totalRevenuePercent, setTotalRevenuePercent] = useState(318);
  const [defaultTotalRevenuePercent, setDefaultTotalRevenuePercent] = useState(318);
  const [totalRevenue, setTotalRevenue] = useState(26.7);
  const [individualIncomeColor, setIndividualIncomeColor] = useState("rgb(10,47,90)");
  const [socialSecurityAndMedicareColor, setSocialSecurityAndMedicareColor] =
    useState("rgb(235,81,96,0.8)");
  const [corporateIncomeColor, setCorporateIncomeColor] = useState("rgb(193,63,119,0.8)");
  const [miscellaneousIncomeColor, setMiscellaneousIncomeColor] = useState("rgb(255,119,62,0.8)");
  const [exciseTaxesColor, setExciseTaxesColor] = useState("rgb(136,60,127,0.8)");
  const [customsDutiesColor, setCustomsDutiesColor] = useState("rgb(255,166,0,0.8)");
  const [estateAndGiftTaxesColor, setEstateAndGiftTaxesColor] = useState("rgb(75,57,116,0.8)");

  const colors = [
    individualIncomeColor,
    corporateIncomeColor,
    socialSecurityAndMedicareColor,
    miscellaneousIncomeColor,
    customsDutiesColor,
    estateAndGiftTaxesColor,
    exciseTaxesColor,
  ]

  const opacityValue = ',0.8';

  const title = 'Sources of Revenue for the U.S. Federal Government, FY 2021';
  const subTitle = 'Revenue by Source Categories';
  const date = new Date();
  const name = 'Monthly Treasury Statement (MTS)';
  const slug = `https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-
  receipts-and-outlays-of-the-u-s-government`;
  const footer =
    <div className={footerContainer}>
      <p>
        <i>
          To explore this visual, hover or tap over any category bubble to discover its data.
        </i>
      </p>
      <p>
        Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
        download this data.
      </p>
    </div>

  const dataHeader = (
    <div className={dataHeaderContainer}>
      <div className={header}>{categoryName}</div>
      <div className={category}>Category</div>
      <div className={dataLabels}>
        <div>
          <div className={headerTitle}>${revenueAmount} T</div>
          <span className={subHeader}>Revenue Amount</span>
        </div>
        <div>
          <div className={headerTitle}>{totalRevenuePercent}%</div>
          <span className={subHeader}>% of Total Revenue</span>
        </div>
      </div>
    </div>
  )

  const labelFormatTable = {
    'Individual Income Taxes': {
      desktop: {
        lines: ['Individual Income Taxes'],
      },
      mobile: {
        lines: ['Individual Income','Taxes'],
      },
    },
    'Corporate Income Taxes': {
      desktop: {
        lines: ['Corporate', 'Income Taxes'],
      },
      mobile: {
        lines: ['Corporate ','Income', 'Taxes'],
      },
    },
    'Social Security and Medicare Taxes': {
      desktop: {
        lines: ['Social Security', 'and Medicare Taxes'],
      },
      mobile: {
        lines: ['Social Security', 'and', 'Medicare Taxes'],
      },
    },
    'Miscellaneous Income': {
      desktop: {
        lines: ['Miscellaneous', 'Income'],
        verticalOffset: -18,
        horizontalOffset: 6 + 43.75
      },
      mobile: {
        lines: ['Miscellaneous', 'Income'],
        verticalOffset: -15,
        horizontalOffset: 30.5
      },
      external: true
    },
    'Customs Duties': {
      desktop: {
        lines: ['Customs Duties'],
        verticalOffset: -15,
        horizontalOffset: 6
      },
      mobile: {
        lines: ['Customs Duties'],
        verticalOffset: -16,
        horizontalOffset: -2
      },
      external: true
    },
    'Estate & Gift Taxes': {
      desktop: {
        lines: ['Estate & Gift Taxes'],
        verticalOffset: -24,
        horizontalOffset: -10
      },
      mobile: {
        lines: ['Estate & Gift Taxes'],
        verticalOffset: -22,
        horizontalOffset: -10
      },
      external: true
    },
    'Excise Taxes': {
      desktop: {
        lines: ['Excise Taxes'],
        verticalOffset: 28,
        horizontalOffset: -95
      },
      mobile: {
        lines: ['Excise Taxes'],
        verticalOffset: 15,
        horizontalOffset: -72
      },
      external: true,
    },
  }

  const LabelComponent = ({node, label}) => {
    const labelFormat = width < pxToNumber(breakpointLg) ?
      labelFormatTable[label].mobile : labelFormatTable[label].desktop;
    const lines = labelFormat.lines;
    const lineSpaceOffset = width < pxToNumber(breakpointLg) ? 12.5 : 16.5;
    const yStartPoint = node.y - ((lines.length / 2) * lineSpaceOffset) + 9;
    const textAnchor = lines.length > 1 ? "middle" : "start";
    const handleLabelMouseEnter = () => {
      HandleMouseEnter(node)
    }
    const handleInteraction = (e) => {
      // only proceed on mouse click or Enter key press
      if (e?.key && e.key !== 'Enter') {
        return;
      }
      HandleMouseEnter(node);
    }
      return (
        <>
          <text
            dominantBaseline="central"
            style={{
              fontSize: width < pxToNumber(breakpointLg) ? 10 : 14,
              fontWeight: semiBoldWeight
            }}
            onMouseEnter={handleLabelMouseEnter}
            onKeyPress={(e) => handleInteraction(e)}
            tabIndex={0}
          >
          {lines.map((line, index) => (
              <React.Fragment key={index} >
                {labelFormatTable[label].external ?
                  (
                    <tspan
                      textAnchor={textAnchor}
                      x={node.radius + node.x + 6 + labelFormat.horizontalOffset}
                      y={yStartPoint + lineSpaceOffset * index + labelFormat.verticalOffset}
                      fill={'#666666'}
                    >
                      {line}
                    </tspan>
                  )
                  :
                  <tspan
                    textAnchor="middle"
                    x={node.x}
                    y={yStartPoint + lineSpaceOffset * index}
                    fill={'#FFFFFF'}
                  >
                    {line}
                  </tspan>
                }
              </React.Fragment>
            )
          )}
          </text>
        </>
    )
  }

  const data = {
    children: [
      {
        id: "Individual Income Taxes",
        value: 85,
      },
      {
        id: "Corporate Income Taxes",
        value: 15,
      },
      {
        id: "Social Security and Medicare Taxes",
        value: 20,
      },
      {
        id: "Miscellaneous Income",
        value: 1.75,
      },
      {
        id: "Customs Duties",
        value: 1,
      },
      {
        id: "Estate & Gift Taxes",
        value: .25,
      },
      {
        id: "Excise Taxes",
        value: 1,
      },
    ]
};

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
      set:(color) => setSocialSecurityAndMedicareColor(color),
      color: socialSecurityAndMedicareColor
    },
    'Miscellaneous Income': {
      set:(color) => setMiscellaneousIncomeColor(color),
      color: miscellaneousIncomeColor
    },
    'Customs Duties': {
      set:(color) => setCustomsDutiesColor(color),
      color: customsDutiesColor
    },
    'Estate & Gift Taxes': {
      set:(color) => setEstateAndGiftTaxesColor(color),
      color: estateAndGiftTaxesColor
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


  const HandleMouseEnter = (node) => {
    if(node.id !== categoryName) {
      decreaseOpacity(categoryName, colorMap[categoryName].color);
      increaseOpacity(node.id, node.color);
      setCategoryName(node.id);
      setRevenueAmount(node.value);
      setTotalRevenuePercent(Number(((node.value / totalRevenue)*100).toFixed()));
    }
  }

  const HandleChartMouseLeave = () => {
    decreaseOpacity(categoryName, colorMap[categoryName].color);
    setIndividualIncomeColor("rgb(10,47,90)");
    setCategoryName("Individual Income Taxes");
    setRevenueAmount(defaultRevenueAmount);
    setTotalRevenuePercent(defaultTotalRevenuePercent);
  }

  return (
    <>
      <ChartContainer
        title={title}
        subTitle={subTitle}
        header={dataHeader}
        footer={footer}
        altText={title}
        date={date}
        customTitleStyles={width < pxToNumber(breakpointLg) ? {fontSize: fontSize_12}: {}}
        customSubTitleStyles={width < pxToNumber(breakpointLg) ? {fontSize: fontSize_12}: {}}
        handleMouseLeave={HandleChartMouseLeave}
      >
        <div className={dataContent} >
          <div className={chartSize}>
            <CirclePacking
              data={data}
              margin={{top: 0, right: 10, bottom:0, left:10}}
              height={ width < pxToNumber(breakpointLg) ? 350 : 500 }
              width={ width < pxToNumber(breakpointLg) ? 350 : 500 }
              colors={colors}
              colorBy={'id'}
              leavesOnly
              enableLabels={true}
              labelsSkipRadius={0}
              labelComponent={({node, label}) =>
                <LabelComponent node={node} label={label} />}
              animate={false}
              onMouseEnter={(node) => HandleMouseEnter(node)}
              onClick={(node) => HandleMouseEnter(node)}
            />
          </div>
          <div className={totalRevenueDataPill}>
            Total Revenue: ${totalRevenue} T
          </div>
        </div>
      </ChartContainer>
    </>
  );
}

export default withWindowSize(SourcesOfRevenueCircleChart);
