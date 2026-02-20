import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons/faArrowRightLong';
import { arrow, imageContainer, link, textContainer, topicHeading, topicSection } from './afg-topic-card.module.scss';
import Analytics from '../../../../../utils/analytics/analytics';
import useGAEventTracking from '../../../../../hooks/useGAEventTracking';
import AFGDefictChart from '../../../sections/overview/deficit-chart/deficit-chart';
import AFGSpendingChart from '../../../sections/overview/spending-chart/spending-chart';
import HeaderChip from '../../../sections/overview/components/header-chip/header-chip';
import { explainerAnalyticsLabelMap, explainerColorMap } from '../../../explainer-helpers/explainer-helpers';
import { pxToNumber } from '../../../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../../../variables.module.scss';
import AFGDebtChart from '../../../sections/overview/debt-chart/debt-chart';
import AFGRevenueChart from '../../../sections/overview/revenue-chart/revenue-chart';

const AfgTopicCard = ({
  heading,
  body,
  linkText,
  linkUrl,
  image,
  imageAltText,
  eventNumber,
  citationClickPage = 'AfgOverview',
  id,
  pageName,
  width,
}) => {
  const { gaEvent } = useGAEventTracking(eventNumber, `${citationClickPage}`);

  const onClickEventHandler = () => {
    if (eventNumber) {
      Analytics.event({
        category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
        action: `AFG Overview Citation Click`,
        label: pageName,
      });
    }
  };

  const getChart = () => {
    switch (id) {
      case 'national-deficit':
        return <AFGDefictChart width={width} />;
      case 'government-revenue':
        return <AFGRevenueChart />;
      case 'federal-spending':
        return <AFGSpendingChart />;
      case 'national-debt':
        return <AFGDebtChart />;
      default:
        return <div />;
    }
  };

  const chart = image ? <img src={image} alt={imageAltText} /> : getChart();

  return (
    <>
      <section>
        {id && <HeaderChip text={explainerAnalyticsLabelMap[id]} color={explainerColorMap[id].primary} />}
        {width >= pxToNumber(breakpointLg) ? (
          <div className={topicSection}>
            <div className={textContainer}>
              <h5 className={topicHeading}>{heading}</h5>
              <div className={body}>{body}</div>
              <a href={linkUrl} className={`${link} afgTopicsLink`} onClick={onClickEventHandler} id={pageName}>
                {linkText}
                <FontAwesomeIcon icon={faArrowRightLong} title="right arrow" className={arrow} />
              </a>
            </div>
            <div className={imageContainer}>
              <div>{chart}</div>
            </div>
          </div>
        ) : (
          <div className={topicSection}>
            <div className={textContainer}>
              <h5 className={topicHeading}>{heading}</h5>
              <div className={imageContainer}>
                <div>{chart}</div>
              </div>
              <div className={body}>{body}</div>
              <a href={linkUrl} className={`${link} afgTopicsLink`} onClick={onClickEventHandler} id={pageName}>
                {linkText}
                <FontAwesomeIcon icon={faArrowRightLong} title="right arrow" className={arrow} />
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AfgTopicCard;
