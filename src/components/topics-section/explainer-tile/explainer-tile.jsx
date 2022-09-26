import React from "react";
import {
  mainContent,
  mainTitle,
  secondaryTitle,
  comingSoon,
  breakpointSm,
} from "./explainer-tile.module.scss";
import { breakpointLg } from "../../../variables.module.scss";
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper";

import Link from "gatsby-link";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Grid } from "@material-ui/core";

const ExplainerTile = ({
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
    layout === "two-col" && isDesktop ? (
      <Grid container spacing={0}>
        <div
          className={mainContent}
          data-testid="tile"
          style={{ display: "flex" }}
        >
          <Grid
            item
            lg={4}
            style={
              isMobile
                ? {}
                : {
                    maxWidth: "260px",
                    maxHeight: "160px",
                  }
            }
          >
            <div style={imageContainerStyle}>{desktop}</div>
          </Grid>
          <Grid item lg={8}>
            <div
              className={content.path ? undefined : comingSoon}
              style={{
                paddingBottom: "0.5rem",
                paddingLeft: "33px",
              }}
            >
              <h5
                className={content.mainFeature ? mainTitle : secondaryTitle}
                style={{ paddingTop: "0" }}
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
          <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>
            {content.title}
          </h5>
          <div style={{ ...(customStyles?.body || {}) }}>
            {content.bodyGenerator ? content.bodyGenerator() : content.body}
          </div>
        </div>
      </div>
    );
  console.log(content.path, "HERE!!");
  const cardHref = content?.path?.endsWith("/")
    ? content.path
    : `${content.path}/`;
  console.log(cardHref, "cardHrefP");
  return (
    <>
      {content.path ? (
        <Link to={cardHref} data-testid={"tile-link"}>
          {card}
        </Link>
      ) : (
        <div>{card}</div>
      )}
    </>
  );
};

export default ExplainerTile;
