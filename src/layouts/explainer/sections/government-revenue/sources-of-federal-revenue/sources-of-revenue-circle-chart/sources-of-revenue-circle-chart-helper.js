import {
  category,
  dataHeaderContainer,
  dataLabels,
  footerContainer,
  header,
  headerTitle,
  subHeader
} from "./sources-of-revenue-circle-chart.module.scss";
import CustomLink from "../../../../../../components/links/custom-link/custom-link";
import React from "react";
import {getShortForm} from "../../../../heros/hero-helper";

export const title = `Sources of Revenue for the U.S. Federal Government, FYTD `;
export const subTitle = 'Revenue by Source Categories';

const name = 'Monthly Treasury Statement (MTS)';
const slug = `/datasets/monthly-treasury-statement/receipts-of-the-u-s-government/`;
export const footer =
  <div className={footerContainer}>
    <p>
      <i>
        To explore this visual, hover over or tap on any category bubble to discover its data.
      </i>
    </p>
    <p>
      Visit the <CustomLink url={slug}>{name}</CustomLink> dataset to explore and
      download this data.
    </p>
  </div>

export const dataHeader = (categoryName, revenueAmount, revenuePercent) => (
  <div className={dataHeaderContainer}>
    <div className={header}>{categoryName}</div>
    <div className={category}>Category</div>
    <div className={dataLabels}>
      <div>
        <div className={headerTitle}>${getShortForm(revenueAmount, 0, true, true)}</div>
        <span className={subHeader}>Revenue Amount</span>
      </div>
      <div>
        <div className={headerTitle}>{revenuePercent.toFixed()}%</div>
        <span className={subHeader}>% of Total Revenue</span>
      </div>
    </div>
  </div>
)
