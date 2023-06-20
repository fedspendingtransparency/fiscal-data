import React from "react";
import {
  mainContent,
  mainTitle,
  secondaryTitle,
  comingSoon,
  breakpointSm,
  explainerImageContainer,
  explainerImage,
  grid,
  rightTile,
  leftTile,
  afgBookIcon,
  iconTitle
} from "./homepage-tile.module.scss";
import { breakpointLg } from "../../../variables.module.scss";
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper";

import Link from "gatsby-link";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Grid } from "@material-ui/core";


const ExplainerTile = ({
  content,
  images,
  width,
  layout,
  hasMobileImage,
  explainerTile,
}) => {
  let desktopImage, mobileImage;
  if (images) {
    desktopImage = images.allFile.topicsImages.find(
      image => image.name === content.desktopImage
    );
    mobileImage = images.allFile.topicsImages.find(
      image => image.name === content.mobileImage
    );
  }

  const afgIcon = '/images/AFG-icon.svg';

  const isDesktop = width >= pxToNumber(breakpointLg);
  // overwrite desktop-first styles with mobile-first styles, if we actually have a mobile image
  const isMobile = hasMobileImage
    ? width <= pxToNumber(breakpointSm)
    : width <= pxToNumber(breakpointLg);

  const desktop = (
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
      className={explainerTile ? explainerImage : null}
    />
  );

  const mobile = (
    <GatsbyImage
      image={getImage(mobileImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
    />
  );

  const card = layout === 'two-col' && isDesktop ? (
      <Grid container spacing={0}>
        <div
          className={mainContent}
          data-testid="tile"
          style={{ display: 'flex' }}
        >
          <Grid item lg={4} className={isMobile ? null : grid}>
            <div className={isMobile && explainerTile ? explainerImageContainer : null}>
              {desktop}
            </div>
          </Grid>
          <Grid item lg={8}>
            <div className={`${content.path ? undefined : comingSoon} ${leftTile}`}>

              <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>
                {content.title}
              </h5>
              <div>
                {content.bodyGenerator ? content.bodyGenerator() : content.body}
              </div>
            </div>
          </Grid>
        </div>
      </Grid>
    ) : (
      <div className={mainContent} data-testid="tile">
        <div className={isMobile && explainerTile ? explainerImageContainer : null}>
          {isMobile ? mobile : desktop}
        </div>
        <div className={content.path ? undefined : comingSoon}>
          <div className={content.mainFeature ? iconTitle : null}>
            {content.mainFeature &&
              <img src={afgIcon}
                   alt="An open book with a coin above the pages."
                   className={afgBookIcon}
              />}
            <h5 className={content.mainFeature ? mainTitle : `${secondaryTitle} ${rightTile}`}>
              {content.title}
            </h5>
          </div>
          <div>
            {content.bodyGenerator ? content.bodyGenerator() : content.body}
          </div>
        </div>
      </div>
    );

  const analyticsHandler = (event, label) => {
    if(event && label) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': event,
        'eventLabel': label,
      });
    }
  };


  return (
    <>
      {content.path ? (
        <Link
          to={content.path}
          data-testid={"tile-link"}
          onClick={() => analyticsHandler('Homepage - Citation Click', content.analyticsName)}
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
