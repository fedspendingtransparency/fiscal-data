import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { createTheme, Grid, ThemeProvider, Divider } from "@material-ui/core";
import ExplainerTile from "./homepage-tile/homepage-tile";
import {
  tileContainer,
  sectionHeader,
  topicsSectionHeader,
  topicsSectionContainer,
  line,
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

  return (
    <div className={topicsSectionContainer}>
      <div className={sectionHeader}>TOPICS</div>
      <h5 className={topicsSectionHeader}>
        <FontAwesomeIcon icon={faBookOpen} />
        <div>Your Guide to America’s Finances</div>
      </h5>
      <div className={tileContainer}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={4}>
            <Grid item lg={mainWidth}>
              <ExplainerTile
                content={pageTileMap["americas-finance-guide"]}
                images={images}
                width={width}
                customStyles={{
                  imageContainer: { marginBottom: "0.5rem" },
                  body: { marginBottom: "1rem" },
                }}
                hasMobileImage
              />
              <div className={line} />

              <ExplainerTile
                content={pageTileMap["revenue"]}
                images={images}
                width={width}
                layout={"two-col"}
                customStyles={{
                  imageContainer: isMobile
                    ? { paddingTop: "0" }
                    : {
                      marginRight: "1rem",
                      width: "260px",
                      height: "160px",
                    },
                  image: { desktop: { width: "260px", height: "160px" } },
                }}
              />
            </Grid>
            {isMobile ? (
              <div className={line} style={{ margin: "0" }} />
            ) : (
              undefined
            )}
            <Grid item lg={secondaryWidth}>
              <ExplainerTile
                content={pageTileMap["spending"]}
                images={images}
                width={width}
              />
              <div className={line} />
              <ExplainerTile
                content={pageTileMap["deficit"]}
                images={images}
                width={width}
              />
              <div className={line} />
              <ExplainerTile
                content={pageTileMap["debt"]}
                images={images}
                width={width}
              />
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default withWindowSize(TopicsSection);
