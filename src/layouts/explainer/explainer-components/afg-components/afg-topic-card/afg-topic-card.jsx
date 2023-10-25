import React from 'react';
import { Grid } from '@material-ui/core';
import { ChartPlaceholder } from '../../../explainer-helpers/national-deficit/national-deficit-helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { topicSection, link, topicHeading, textContainer, imageContainer, arrow } from './afg-topic-card.module.scss';
import Analytics from '../../../../../utils/analytics/analytics';
import useGAEventTracking from '../../../../../hooks/useGAEventTracking';
import AFGDefictChart from '../../../sections/overview/deficit-chart/deficit-chart';
import AFGSpendingChart from '../../../sections/overview/spending-chart/spending-chart';
import AFGRevenueChart from '../../../sections/overview/revenue-chart/revenue-chart';
import HeaderChip from '../../../sections/overview/components/header-chip/header-chip';
import { explainerAnalyticsLabelMap, explainerColorMap } from '../../../explainer-helpers/explainer-helpers';

const AfgTopicCard = ({ heading, body, linkText, linkUrl, image, imageAltText, eventNumber, citationClickPage = 'AfgOverview', id, pageName }) => {
  const { gaEvent } = useGAEventTracking(eventNumber, citationClickPage);

  const onClickEventHandler = () => {
    if (eventNumber) {
      Analytics.event({
        category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }
  };

  const getChart = () => {
    switch (id) {
      case 'national-deficit':
        return <AFGDefictChart />;
      case 'government-revenue':
        return <AFGRevenueChart />;
      case 'federal-spending':
        return <AFGSpendingChart />;
      default:
        return <ChartPlaceholder />;
    }
  };

  return (
    <>
      <HeaderChip text={explainerAnalyticsLabelMap[id]} color={explainerColorMap[id].primary} />
      <Grid classes={{ root: topicSection }} container spacing={0} data-testid="topic-section" key={linkUrl}>
        <Grid item md classes={{ root: textContainer }}>
          <h5 className={topicHeading}>{heading}</h5>
          <div className={body}>{body}</div>
          <a
            href={linkUrl}
            style={{ color: explainerColorMap[id].primary }}
            className={`${link} afgTopicsLink`}
            onClick={onClickEventHandler}
            id={pageName}
          >
            {linkText}
            <FontAwesomeIcon icon={faArrowRightLong} title="right arrow" className={arrow} />
          </a>
        </Grid>
        <Grid item md classes={{ root: imageContainer }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>{image ? <img src={image} alt={imageAltText} /> : getChart()}</div>
        </Grid>
      </Grid>
    </>
  );
};

export default AfgTopicCard;
