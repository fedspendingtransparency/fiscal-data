import React, { useState } from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import { CirclePacking, ResponsiveCirclePacking } from '@nivo/circle-packing';
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import {
  dataHeaderContainer,
  header,
  dataLabels,
  headerTitle,
  subHeader,
  category,
  footerContainer,
  totalRevenueDataPill
} from "./sources-of-revenue-circle-chart.module.scss";
import { withWindowSize } from "react-fns";
import {breakpointLg, semiBoldWeight} from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";

const SourcesOfRevenueCircleChart = ({ width }) => {

  const [categoryName, setCategoryName] = useState("Individual Income Taxes");
  const [revenueAmount, setRevenueAmount] = useState(2);
  const [totalRevenuePercent, setTotalRevenuePercent] = useState(51);
  const [totalRevenue, setTotalRevenue] = useState(26.7);

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

  const LabelComponent = ({node, style, label}) => {
    const labelFormat = width < pxToNumber(breakpointLg) ?
      labelFormatTable[label].mobile : labelFormatTable[label].desktop;
    const lines = labelFormat.lines; //labelFormatTable[label].desktop;
    const lineSpaceOffset = width < pxToNumber(breakpointLg) ? 12.5 : 16.5;
    const yStartPoint = node.y - ((lines.length / 2) * lineSpaceOffset) + 9;
      return (
        <>
          {lines.map((line, index) => (
              <>
                {labelFormatTable[label].external ?
                  (
                    <text
                      textAnchor={lines.length > 1 ? "middle" : "start"}
                      dominantBaseline="central"
                      x={node.radius + node.x + 6 + labelFormat.horizontalOffset}
                      y={yStartPoint + lineSpaceOffset * index + labelFormat.verticalOffset}
                      fill={'#666666'}
                      style={{
                        fontSize: width < pxToNumber(breakpointLg) ? 10 : 14,
                        fontWeight: semiBoldWeight
                      }}
                    >
                      {line}
                    </text>
                  )
                  :
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    x={node.x}
                    y={yStartPoint + lineSpaceOffset * index}
                    fill={'#FFFFFF'}
                    style={{
                      fontSize: width < pxToNumber(breakpointLg) ? 10 : 14,
                      fontWeight: semiBoldWeight,
                      fontColor: '#FFFFFF'
                    }}
                  >
                    {line}
                  </text>
                }
              </>
            )
          )}
        </>
    )
  }

  const individualIncomeTaxes = "rgb(10,47,90, 0.8)" //"#0A2F5A";
  const SocialSecurityAndMedicareTaxes = "rgb(235,81,96, 0.8)" //"#EB5160";
  const CorporateIncomeTaxes = "rgb(193, 63, 119, 0.8)" //"#C13F77";
  const MiscellaneousIncome = "rgb(255, 119, 62, 0.8)" //"#FF773E";
  const ExciseTaxes = "rgb(136, 60, 127, 0.8)" //"#883C7F";
  const CustomsDuties = "rgb(255, 166, 0, 0.8)" //"#FFA600";
  const EstateAndGiftTaxes = "rgb(75, 57, 116, 0.8)" //"#4B3974";

  const colors = [
    individualIncomeTaxes,
    CorporateIncomeTaxes,
    SocialSecurityAndMedicareTaxes,
    MiscellaneousIncome,
    CustomsDuties,
    EstateAndGiftTaxes,
    ExciseTaxes,
  ];

  const theme = {
    "textColor": '#FFFFFF',
    "fontSize":  width < pxToNumber(breakpointLg) ? '12px' : '14px',
    "legend": {
      "text": {
        "fontSize": 12,
        "fill": "#FFFFFF"
      }
    },
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

  return (
    <>
      <ChartContainer
        title={title}
        subtitle={subTitle}
        header={dataHeader}
        footer={footer}
        altText={title}
        date={date}
      >
        <div style={{display:'flex', justifyContent:'center', flexDirection: 'column'}} >
          <div style={{height: width < pxToNumber(breakpointLg) ? '325px' : '450px', overflow: 'hidden'}}>
            <CirclePacking
              data={data}
              margin={{top: 0, right: 10, bottom:0, left:10}}
              height={ width < pxToNumber(breakpointLg) ? 350 : 500 }
              width={ width < pxToNumber(breakpointLg) ? 350 : 500 }
              colors={colors}
              colorBy={'id'}
              // theme={theme}
              leavesOnly
              enableLabels={true}
              labelsSkipRadius={0}
              labelComponent={({node, label}) =>
                <LabelComponent node={node}  label={label} />}
              animate={false}
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
