import React from "react";
import {
  mainContent,
  mainTitle,
  secondaryTitle,
  comingSoon,
  breakpointSm,
  afgBookIcon,
} from "./homepage-tile.module.scss";
import { breakpointLg } from "../../../variables.module.scss";
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper";

import Link from "gatsby-link";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Grid } from "@material-ui/core";

const HomePageTile = ({
  content,
  images,
  width,
  customStyles,
  layout,
  hasMobileImage,  
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

  const afgBookIconSource = '/images/AFG-icon.svg';
  

  const isDesktop = width >= pxToNumber(breakpointLg);
  // over write desktop-first styles with mobile-first styles, if we actually have a mobile imgage
  const isMobile = hasMobileImage
    ? width <= pxToNumber(breakpointSm)
    : width <= pxToNumber(breakpointLg);
  const imageStyle = isMobile ? {} : { ...customStyles?.image?.desktop };
  const imageContainerStyle = isMobile
    ? {}
    : customStyles?.imageContainer || {};
  const desktop = (
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
      style={imageStyle}
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

  const card =
    layout === 'two-col' && isDesktop ? (
      <Grid container spacing={0}>
        <div
          className={mainContent}
          data-testid="tile"
          style={{ display: 'flex' }}
        >
          <Grid
            item
            lg={4}
            style={
              isMobile
                ? {}
                : {
                    maxWidth: '260px',
                    maxHeight: '160px',
                  }
            }
          >
            <div style={imageContainerStyle}>{desktop}</div>
          </Grid>
          <Grid item lg={8}>
            <div
              className={content.path ? undefined : comingSoon}
              style={{
                paddingBottom: '0.5rem',
                paddingLeft: '33px',
              }}
            >
              <h5
                className={content.mainFeature ? mainTitle : secondaryTitle}
                style={{ paddingTop: '0' }}
              >
                {content.title}
              </h5>
              <div style={{ ...(customStyles?.body || {}) }}>
                {content.bodyGenerator ? content.bodyGenerator() : content.body}
              </div>
            </div>
          </Grid>
        </div>
      </Grid>
    ) : (
      <div className={mainContent} data-testid="tile">
        <div style={imageContainerStyle}>{isMobile ? mobile : desktop}</div>
        <div className={content.path ? undefined : comingSoon}>
          <Grid container spacing={2}
            alignItems="center">
            {content.mainFeature && (
              <Grid item xs={isMobile ? 2 : 1}>
                <img
                  src={afgBookIconSource}
                  alt="An open book with a coin above the pages"
                  className={afgBookIcon}
                />
              </Grid>
            )}
            <Grid item xs={isMobile ? 10 : 11}>
              <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>
                <span>{content.title}</span>
              </h5>
            </Grid>
          </Grid>

          <div style={{ ...(customStyles?.body || {}) }}>
            {content.bodyGenerator ? content.bodyGenerator() : content.body}
          </div>
        </div>
      </div>
    );
  return (
    <>
      {content.path ? (
        <Link to={content.path} data-testid={"tile-link"}>
          {card}
        </Link>
      ) : (
        <div>{card}</div>
      )}
    </>
  );
};

export default HomePageTile;
