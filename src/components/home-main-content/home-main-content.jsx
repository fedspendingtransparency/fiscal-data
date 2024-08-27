import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HomeHighlightCards from '../home-highlight-cards/home-highlight-cards';
import { mainContent, sectionHeader, highlightCardsHeader } from './home-main-content.module.scss';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import CustomLink from '../links/custom-link/custom-link';
import Analytics from '../../utils/analytics/analytics';
import { ga4DataLayerPush } from '../../helpers/google-analytics/google-analytics-helper';

const HomeMainContent = () => {
  const analyticsHandler = label => {
    Analytics.event({
      category: 'Homepage Navigation',
      action: 'Citation Click',
      label: label,
    });
  };
  const datasetSearchPage = (
    <CustomLink url="/datasets/" id="Dataset Search" onClick={() => analyticsHandler('Dataset Search')}>
      Dataset Search page
    </CustomLink>
  );
  return (
    <>
      <div data-testid="home-main-content" className={mainContent}>
        <div className={sectionHeader}>DATASET SEARCH</div>
        <h5 className={highlightCardsHeader}>
          <FontAwesomeIcon icon={faChartColumn} />
          Today in Fiscal Data:
        </h5>
        <p>
          See how our data helps answer key questions about the federal government's accounting, central payment systems, and public debt. Looking for
          more? Choose a dataset below or select any dataset from our {datasetSearchPage}, to find out how numbers have changed over time, see a data
          preview, and download the data for further analysis.
        </p>
      </div>
      <HomeHighlightCards />
    </>
  );
};

export default HomeMainContent;
