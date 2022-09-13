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
  label,
  totalRevenueDataPill
} from "./sources-of-revenue-circle-chart.module.scss";
import { withWindowSize } from "react-fns";
import { breakpointLg } from "../../../../../../variables.module.scss";
import {pxToNumber} from "../../../../../../helpers/styles-helper/styles-helper";

const SourcesOfRevenueCircleChart = ({width}) => {

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
    <>
      <p>
        <i>
          To explore this visual, hover or tap over any category bubble to discover its data.
        </i>
      </p>
      <p>
        Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
        download this data.
      </p>
    </>

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
      desktop: ['Individual Income Taxes'],
      mobile: ['Individual Income','Taxes']
    },
    'Corporate Income Taxes': {
      desktop: ['Corporate', 'Income Taxes'],
      mobile: ['Corporate ','Income', 'Taxes']
    },
    'Social Security and Medicare Taxes': {
      desktop: ['Social Security', 'and Medicare Taxes'],
      mobile: ['Social Security', 'and', 'Medicare Taxes']
    },
    'Miscellaneous Income': {
      desktop: ['Miscellaneous', 'Income'],
      mobile: ['Miscellaneous', 'Income'],
      external: true,
      verticalOffset: -18,
      horizontalOffset: 6 + 43.75
    },
    'Customs Duties': {
      desktop: ['Customs Duties'],
      mobile: ['Customs Duties'],
      external: true,
      verticalOffset: -15,
      horizontalOffset: 6
    },
    'Estate & Gift Taxes': {
      desktop: ['Estate & Gift Taxes'],
      mobile: ['Estate & Gift Taxes'],
      external: true,
      verticalOffset: -24,
      horizontalOffset: -10
    },

    'Excise Taxes': {
      desktop: ['Excise Taxes'],
      mobile: ['Excise Taxes'],
      external: true,
      verticalOffset: 28,
      horizontalOffset: -80
    },
  }

  const LabelComponent = ({node, style, label}) => {
    console.log(node)
    const lines = labelFormatTable[label].desktop;
    const yStartPoint = node.y - ((lines.length / 2) * 16.5) + 9;
      return (
        <>
          {lines.map((line, index) => (
              <>
                {labelFormatTable[label].external ?
                  (
                    <text
                      textAnchor={lines.length > 1 ? "middle" : "start"}
                      dominantBaseline="central"
                      x={node.radius + node.x + 6 + labelFormatTable[label].horizontalOffset}
                      y={yStartPoint + 16.5 * index + labelFormatTable[label].verticalOffset}
                      fill={'#666666'}
                      style={{
                        fontSize: 14,
                        fontWeight: 600
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
                    y={yStartPoint + 16.5 * index}
                    fill={'#FFFFFF'}
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      maxWidth: 90
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

  const individualIncomeTaxes = "#0A2F5A";
  const SocialSecurityAndMedicareTaxes = "#EB5160";
  const CorporateIncomeTaxes = "#C13F77";
  const MiscellaneousIncome = "#FF773E";
  const ExciseTaxes = "#883C7F";
  const CustomsDuties = "#FFA600";
  const EstateAndGiftTaxes = "#4B3974";

  const colors = [
    individualIncomeTaxes,
    CorporateIncomeTaxes,
    SocialSecurityAndMedicareTaxes,
    MiscellaneousIncome,
    ExciseTaxes,
    CustomsDuties,
    EstateAndGiftTaxes,
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
    id: "parent",
    // color: 'rgb(10,47,90)',

    children: [
      {
        id: "Individual Income Taxes",
        value: 85,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Corporate Income Taxes",
        value: 15,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Social Security and Medicare Taxes",
        value: 20,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Miscellaneous Income",
        value: 1.75,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Customs Duties",
        value: 1,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Estate & Gift Taxes",
        value: .25,
        // color: 'rgb(10,47,90)'
      },
      {
        id: "Excise Taxes",
        value: 1,
        // color: 'rgb(10,47,90)'
      },
    ]
};

  const customStyle =
  {
    width: '10px',
    height: '10px'
  }
  //overflow hidden
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
          <div style={{height: '465px', overflow: 'hidden'}}>
            <CirclePacking
              data={data}
              margin={{top: 10, right: 10, bottom:0, left:10}}
              height={ width < pxToNumber(breakpointLg) ? 300 : 500 }
              width={ width < pxToNumber(breakpointLg) ? 300 : 500 }
              colors={colors}
              colorBy={'id'}
              // inheritColorFromParent={false}
              theme={theme}
              leavesOnly
              enableLabels={true}
              labelTextColor="#FFFFFF"
              labelsSkipRadius={0}
              // labelsFilter={label => label.node.depth === 1}
              labelComponent={({node, label, style}) =>
                <LabelComponent node={node} style={style} label={label} />}
              borderWidth={0}
              borderColor={{
                from: 'color',
                modifiers: [
                  [
                    'darker',
                    '0'
                  ]
                ]
              }}
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
