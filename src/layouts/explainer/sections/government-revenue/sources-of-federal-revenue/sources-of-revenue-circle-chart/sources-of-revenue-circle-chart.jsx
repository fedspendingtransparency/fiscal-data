import React, {useState} from "react";
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
import {pillDataValue} from "../../../../hero-image/hero-image.module.scss";

const SourcesOfRevenueCircleChart = () => {
  const [categoryName, setCategoryName] = useState("Individual Income Taxes");
  const [revenueAmount, setRevenueAmount] = useState(2);
  const [totalRevenuePercent, setTotalRevenuePercent] = useState(51);
  const [totalRevenue, setTotalRevenue] = useState(26.7);

  const title = 'Sources of Revenue for the U.S. Federal Government';
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

  const LabelComponent = ({labelText}) => (
    <div className={label}>
      {labelText}
    </div>
  )


  const individualIncomeTaxes = "#0A2F5A";
  const SocialSecurityAndMedicareTaxes = "#EB5160";
  const CorporateIncomeTaxes = "#C13F77";
  const MiscellaneousIncome = "#FF773E";
  const ExciseTaxes = "#883C7F";
  const CustomsDuties = "#FFA600";
  const EstateAndGiftTaxes = "#4B3974";
  const Blank = "transparent";

  const colors = [
    individualIncomeTaxes,
    CorporateIncomeTaxes,
    SocialSecurityAndMedicareTaxes,
    MiscellaneousIncome,
    ExciseTaxes,
    Blank,
    CustomsDuties,
    EstateAndGiftTaxes,
    Blank,
    Blank,
  ];

  const theme = {
    "textColor": '#FFFFFF',
    "fontSize": '14px',
    "legend": {
      "text": {
        "fontSize": 12,
        "fill": "#FFFFFF"
      }
    },
  }

  const data = {
    id: "tester",
    children: [
      {
        id: "Individual Income Taxes",
        value: 65,
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
        value: 3,
      },
      {
        id: "Excise Taxes",
        value: 2,
      },
      {
        id: "",
        value: 2,
      },
      {
        id: "Customs Duties",
        value: 1,
      },
      {
        id: "",
        value: .5,
      },
      {
        id: "",
        value: .5,
      },
      {
        id: "Estate & Gift Taxes",
        value: .5,
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
        <div style={{display:'flex', justifyContent:'center', flexDirection: 'column'}}>
          <CirclePacking
          data={data}
          margin={{top: 20, right: 20, bottom:20, left:20}}
          colors={colors}
          colorBy={'id'}
          height={500}
          width={500}
          leavesOnly={true}
          theme={theme}
          enableLabels={true}
          labelTextColor="#FFFFFF"
          // labelComponent={({id}) => <LabelComponent labelText={id} />}
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
          />
          <div className={totalRevenueDataPill}>
            Total Revenue: ${totalRevenue} T
          </div>
        </div>
      </ChartContainer>
    </>
  );
}

export default SourcesOfRevenueCircleChart;
