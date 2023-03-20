import React from "react";
import { createTheme, Grid, ThemeProvider } from "@material-ui/core";
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
        lg: pxToNumber(breakpointLg),
      },
    },
  });


  const explainerTiles = ['revenue', 'spending', 'deficit', 'debt'];

  return (
    <div className={topicsSectionContainer}>
      <div className={tileContainer}>
        <ThemeProvider theme={theme} >
          <Grid container spacing={4} direction={width < pxToNumber(breakpointLg) ? "column-reverse" : "row"}>
            <Grid item lg={mainWidth}>
              <div className={sectionHeader}>AMERICA’S FINANCE GUIDE</div>
              <HomePageTile
                content={pageTileMap['americas-finance-guide']}
                images={images}
                width={width}
                hasMobileImage
                hasIcon
              />
              {explainerTiles.map((tile) => {
                return (
                  <React.Fragment key={tile}>
                    <div className={line} />
                    <HomePageTile
                      content={pageTileMap[tile]}
                      images={images}
                      width={width}
                      layout={'two-col'}
                      explainerTile
                    />
                  </React.Fragment>
                )
              })}
            </Grid>
            <Grid item lg={secondaryWidth}>
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
