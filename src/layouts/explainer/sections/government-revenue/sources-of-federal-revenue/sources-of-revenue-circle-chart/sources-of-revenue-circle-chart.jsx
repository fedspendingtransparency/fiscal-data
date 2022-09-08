import React from "react";
import ChartContainer from "../../../../explainer-components/chart-container/chart-container";
import { CirclePacking, ResponsiveCirclePacking } from '@nivo/circle-packing';
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import { dataHeaderContainer, header } from "./sources-of-revenue-circle-chart.module.scss";

const SourcesOfRevenueCircleChart = () => {
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
      <div className={header}>Social Security and Medicare Taxes</div>
      <div>Category</div>

    </div>
  )

  const data = {
    id: "tester",
    children: [
      {
        id: "IndividualIncomeTaxes",
        name: "Individual Income Taxes",
        color: "#0A2F5A",
        value: 75,
      },
      {
        id: "SocialSecurityAndMedicareTaxes",
        name: "Social Security and Medicare Taxes",
        color: "#EB5160",
        value: 20,
      },
      {
        id: "CorporateIncomeTaxes",
        name: "Corporate Income Taxes",
        color: "#C13F77",
        value: 15,
      },
      {
        id: "MiscellaneousIncome",
        name: "Miscellaneous Income",
        color: "#FF773E",
        value: 5,
      },
      {
        id: "ExciseTaxes",
        name: "Excise Taxes",
        color: "#883C7F",
        value: 4,
      },
      {
        id: "CustomsDuties",
        name: "Customs Duties",
        color: "#FFA600",
        value: 3,
      },
      {
        id: "Estate&GiftTaxes",
        name: "Estate & Gift Taxes",
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
          id={"name"}
          childColor={{from: 'color'}}
          inheritColorFromParent={true}
          height={500}
          width={500}
          enableLabels={true}
          leavesOnly={true}
          colorBy="id"
          />
        </div>
      </ChartContainer>
    </>
  );
}

export default SourcesOfRevenueCircleChart;
