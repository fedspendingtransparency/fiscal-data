import React from "react";
import { createTheme, Grid, ThemeProvider, Divider } from "@material-ui/core";
import HomePageTile from "./homepage-tile/homepage-tile";
import {
  tileContainer,
  sectionHeader,
  topicsSectionContainer,
  line,
  insightsSectionContainer
} from "./topics-section.module.scss";
import { withWindowSize } from "react-fns";
import { breakpointLg } from "../../variables.module.scss";
import { pxToNumber } from "../../helpers/styles-helper/styles-helper";
import { pageTileMap } from "./homepage-tile/homepage-tile-helper";

export const TopicsSection = ({ images, width }) => {
  const mainWidth = 8;
  const secondaryWidth = 4;

  const theme = createTheme({
    breakpoints: {
      values: {
        lg: 992,
      },
    },
  });

  const isMobile = width < pxToNumber(breakpointLg);
  const leftTileStyle = {
    imageContainer: isMobile
      ? { paddingTop: "0" }
      : {
          marginRight: "1rem",
          width: "260px",
          height: "160px",
        },
    image: { desktop: { width: "260px", height: "160px" } },
  }

  return (
    <div className={topicsSectionContainer}>
      <div className={tileContainer}>
        <ThemeProvider theme={theme} >
          <Grid container spacing={4} direction={isMobile ? "column-reverse" : ""}>
            <Grid item lg={mainWidth} spacing={0}>
              <div className={sectionHeader}>AMERICA’S FINANCE GUIDE</div>
              <HomePageTile
                content={pageTileMap['americas-finance-guide']}
                images={images}
                width={width}
                customStyles={{
                  imageContainer: { marginBottom: '0.5rem' },
                  body: { marginBottom: '1rem' },
                }}
                hasMobileImage
              />
              <div className={line} />

              <HomePageTile
                content={pageTileMap['revenue']}
                images={images}
                width={width}
                layout={'two-col'}
                customStyles={leftTileStyle}
              />
              <div className={line} />
              <HomePageTile
                content={pageTileMap['spending']}
                images={images}
                width={width}
                layout={'two-col'}
                customStyles={leftTileStyle}
              />

              <div className={line} />
              <HomePageTile
                content={pageTileMap['deficit']}
                images={images}
                width={width}
                layout={'two-col'}
                customStyles={leftTileStyle}
              />
              <div className={line} />
              <HomePageTile
                content={pageTileMap['debt']}
                images={images}
                width={width}
                layout={'two-col'}
                customStyles={leftTileStyle}
              />
            </Grid>
            <Grid item lg={secondaryWidth} spacing={0}>
              <div className={insightsSectionContainer}>
                <div className={sectionHeader}>TOOLS</div>
                <HomePageTile
                  content={pageTileMap['currency-exchange-rates']}
                  images={images}
                  width={width}
                />
              </div>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default withWindowSize(TopicsSection);
