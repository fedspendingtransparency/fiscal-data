import React from 'react';
import PollIcon from '@material-ui/icons/Poll';
import HomeHighlightCards from '../home-highlight-cards/home-highlight-cards';
import {
  mainContent,
  highlightCardsHeader
} from './home-main-content.module.scss';

const HomeMainContent = () => (
  <>
    <div data-testid="home-main-content" className={mainContent}>
      <h2 className={highlightCardsHeader}>
        <PollIcon />
        Today in Fiscal Data:
      </h2>
      <p>
        <strong>
          See how our data helps answer key questions about the federal government's accounting,
          central payment systems, and public debt.{' '}
        </strong>
        Looking for more? Choose a dataset to find out how numbers have changed over time,
        see a data preview, and download the data for further analysis.
      </p>
    </div>
    <HomeHighlightCards />
  </>
);

export default HomeMainContent;
