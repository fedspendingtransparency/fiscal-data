import React from "react";
import {
  mainContent,
  mainTitle,
  secondaryTitle,
  comingSoon,
} from "./explainer-tile.module.scss";
import { breakpointLg } from "../../../variables.module.scss";
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper";

import Link from "gatsby-link";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { Grid } from "@material-ui/core";

const ExplainerTile = ({ content, images, width, customStyles, layout }) => {
  let desktopImage, mobileImage;
  if (images) {
    desktopImage = images.allFile.topicsImages.find(
      image => image.name === content.desktopImage
    );
    mobileImage = images.allFile.topicsImages.find(
      image => image.name === content.mobileImage
    );
  }

  const desktop = (
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
      style={{ ...customStyles?.image?.desktop }}
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

  const isDesktop = width >= pxToNumber(breakpointLg);
  const card =
    layout === "two-col" && isDesktop ? (
      <Grid container spacing={4}>
        <div
          className={mainContent}
          data-testid="tile"
          style={{ display: "flex" }}
        >
          <Grid lg={4}>
            <div style={{ ...(customStyles?.imageContainer || {}) }}>
              {isDesktop ? desktop : mobile}
            </div>
          </Grid>
          <Grid lg={8}>
            <div
              className={content.path ? undefined : comingSoon}
              style={{
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "33px",
                maxWidth: "88%",
              }}
            >
              <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>
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
        <div style={{ ...(customStyles?.imageContainer || {}) }}>
          {width >= pxToNumber(breakpointLg) ? desktop : mobile}
        </div>
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

export default ExplainerTile;
