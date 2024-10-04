import {
  category,
  dataHeaderContainer,
  dataLabels,
  footerContainer,
  header,
  headerTitle,
  subHeader,
} from './sources-of-revenue-circle-chart.module.scss';
import React from 'react';
import { getShortForm } from '../../../../../../utils/rounding-utils';
import { explainerCitationsMap } from '../../../../explainer-helpers/explainer-helpers';

export const title = `Sources of Revenue for the U.S. Federal Government, FYTD `;
export const subTitle = 'Revenue by Source Categories';
const { mtsReceipts } = explainerCitationsMap['government-revenue'];

export const footer = (
  <div className={footerContainer}>
    <p>
      <i>To explore this visual, hover over or tap on any category bubble to discover its data.</i>
    </p>
    <p>Visit the {mtsReceipts} dataset to explore and download this data.</p>
  </div>
);

export const dataHeader = (categoryName, revenueAmount, revenuePercent) => (
  <div className={dataHeaderContainer}>
    <div className={header}>{categoryName}</div>
    <div className={category}>Category</div>
    <div className={dataLabels}>
      <div>
        <div className={headerTitle}>${getShortForm(revenueAmount)}</div>
        <span className={subHeader}>Revenue Amount</span>
      </div>
      <div>
        <div className={headerTitle}>{revenuePercent.toFixed()}%</div>
        <span className={subHeader}>% of Total Revenue</span>
      </div>
    </div>
  </div>
);
