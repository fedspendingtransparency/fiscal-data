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
  category
} from "./sources-of-revenue-circle-chart.module.scss";

const SourcesOfRevenueCircleChart = () => {
  const [categoryName, setCategoryName] = useState("Individual Income Taxes");
  const [revenueAmount, setRevenueAmount] = useState(2);
  const [totalRevenuePercent, setTotalRevenuePercent] = useState(51);


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
  const individualIncomeTaxes = "#0A2F5A";
  const SocialSecurityAndMedicareTaxes = "#EB5160";
  const CorporateIncomeTaxes = "#C13F77";
  const MiscellaneousIncome = "#FF773E";
  const ExciseTaxes = "#883C7F";
  const CustomsDuties = "#FFA600";
  const EstateAndGiftTaxes = "#4B3974";

  const colors = [
    individualIncomeTaxes,
    SocialSecurityAndMedicareTaxes,
    CorporateIncomeTaxes,
    MiscellaneousIncome,
    ExciseTaxes,
    CustomsDuties,
    EstateAndGiftTaxes
  ];

  const theme = {
    textColor: '#FFFFFF',
    fontSize: '14px',
  }

  const data = {
    id: "tester",
    children: [
      {
        id: "Individual Income Taxes",
        color: "#0A2F5A",
        value: 75,
      },
      {
        id: "Social Security and Medicare Taxes",
        color: "#EB5160",
        value: 20,
      },
      {
        id: "Corporate Income Taxes",
        color: "#C13F77",
        value: 15,
      },
      {
        id: "Miscellaneous Income",
        color: "#FF773E",
        value: 5,
      },
      {
        id: "Excise Taxes",
        color: "#883C7F",
        value: 4,
      },
      {
        id: "Customs Duties",
        color: "#FFA600",
        value: 3,
      },
      {
        id: "Estate & Gift Taxes",
        color: "#4B3974",
        value: 2,
      }
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
        <div>
          <CirclePacking
          data={data}
          margin={{top: 20, right: 20, bottom:20, left:20}}
          colors={colors}
          colorBy={'id'}
          height={500}
          width={500}
          enableLabels={true}
          leavesOnly={true}
          theme={theme}
          />
        </div>
      </ChartContainer>
    </>
  );
}

export default SourcesOfRevenueCircleChart;
