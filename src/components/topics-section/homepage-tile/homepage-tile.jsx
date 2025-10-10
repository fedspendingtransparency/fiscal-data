import React from 'react';
import {
  afgBookIcon,
  breakpointSm,
  comingSoon,
  explainerImage,
  explainerImageContainer,
  grid,
  iconTitle,
  leftTile,
  mainContent,
  mainTitle,
  rightTile,
  secondaryTitle,
} from './homepage-tile.module.scss';
import { breakpointLg } from '../../../variables.module.scss';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';

import Link from 'gatsby-link';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Grid from '@mui/material/Grid';
import Analytics from '../../../utils/analytics/analytics';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

let homepageTile;
const ExplainerTile = ({ content, images, width, layout, hasMobileImage, explainerTile }) => {
  let desktopImage, mobileImage;
  if (images) {
    desktopImage = images.allFile.topicsImages.find(image => image.name === content.desktopImage);
    mobileImage = images.allFile.topicsImages.find(image => image.name === content.mobileImage);
  }

  const afgIcon = '/images/AFG-icon.svg';

  const isDesktop = width >= pxToNumber(breakpointLg);
  // overwrite desktop-first styles with mobile-first styles, if we actually have a mobile image
  const isMobile = hasMobileImage ? width <= pxToNumber(breakpointSm) : width <= pxToNumber(breakpointLg);

  const desktop = (
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
      className={explainerTile ? explainerImage : null}
    />
  );

  const mobile = <GatsbyImage image={getImage(mobileImage)} alt={content.altText} loading="eager" role="presentation" />;

  const card =
    layout === 'two-col' && isDesktop ? (
      <div className={mainContent} data-testid="tile">
        <Grid container spacing={0}>
          <Grid size={{ lg: 4 }} className={isMobile ? null : grid}>
            <div className={isMobile && explainerTile ? explainerImageContainer : null}>{desktop}</div>
          </Grid>
          <Grid size={{ lg: 8, md: 6 }}>
            <div className={`${content.path ? undefined : comingSoon} ${leftTile}`}>
              <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>{content.title}</h5>
              <div>{content.bodyGenerator ? content.bodyGenerator() : content.body}</div>
            </div>
          </Grid>
        </Grid>
      </div>
    ) : (
      <div className={mainContent} data-testid="tile">
        <div className={isMobile && explainerTile ? explainerImageContainer : null}>{isMobile ? mobile : desktop}</div>
        <div className={content.path ? undefined : comingSoon}>
          <div className={content.mainFeature ? iconTitle : null}>
            {content.mainFeature && <img src={afgIcon} alt="An open book with a coin above the pages." className={afgBookIcon} />}
            <h5 className={content.mainFeature ? mainTitle : `${secondaryTitle} ${rightTile}`}>{content.title}</h5>
          </div>
          <div>{content.bodyGenerator ? content.bodyGenerator() : content.body}</div>
        </div>
      </div>
    );

  const analyticsHandler = (event, label) => {
    Analytics.event({
      category: 'Homepage Navigation',
      action: 'Citation Click',
      label: label,
    });
    ga4DataLayerPush({
      event: event,
      eventLabel: label,
    });
  };

  const handleMouseEnter = label => {
    homepageTile = setTimeout(() => {
      Analytics.event({
        category: 'Homepage Cards',
        action: 'Card Hover',
        label: label,
      });
    }, 3000);
  };
  const handleMouseLeave = () => {
    clearTimeout(homepageTile);
  };
  return (
    <>
      {content.path ? (
        <Link
          to={content.path}
          data-testid="tile-link"
          onClick={() => analyticsHandler('Citation Click', content.analyticsName)}
          onMouseEnter={() => handleMouseEnter(content.analyticsName)}
          onMouseLeave={handleMouseLeave}
        >
          {card}
        </Link>
      ) : (
        <div>{card}</div>
      )}
    </>
  );
};

export default ExplainerTile;
