import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePageTile from './homepage-tile/homepage-tile';
import { insightsSectionContainer, line, sectionHeader, tileContainer, topicsGrid, topicsSectionContainer } from './topics-section.module.scss';
import { breakpointLg, breakpointMd } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { pageTileMap } from './homepage-tile/homepage-tile-helper';

export const TopicsSection = ({ images, width }) => {
  const mainWidth = 8;
  const secondaryWidth = 4;

  const theme = createTheme({
    breakpoints: {
      values: {
        lg: pxToNumber(breakpointLg),
        md: pxToNumber(breakpointMd),
      },
    },
  });

  const explainerTiles = ['revenue', 'spending', 'deficit', 'debt'];

  return (
    <div className={topicsSectionContainer} data-testid="topics-section">
      <div className={tileContainer}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={4} className={topicsGrid}>
            <Grid size={{ lg: mainWidth }}>
              <Stack>
                <div className={sectionHeader}>AMERICA’S FINANCE GUIDE</div>
                <HomePageTile content={pageTileMap['americas-finance-guide']} images={images} width={width} hasMobileImage hasIcon />
                {explainerTiles.map(tile => {
                  return (
                    <React.Fragment key={tile}>
                      <div className={line} />
                      <HomePageTile content={pageTileMap[tile]} images={images} layout="two-col" explainerTile />
                    </React.Fragment>
                  );
                })}
              </Stack>
            </Grid>
            <Grid container size={{ lg: secondaryWidth }}>
              <div className={insightsSectionContainer}>
                <div className={sectionHeader}>FEATURED TOPICS</div>
                <HomePageTile content={pageTileMap['state-and-local-government-series']} images={images} />
                <div className={line} />
                <HomePageTile content={pageTileMap['interest-expense']} images={images} />
                <div className={line} />
                <HomePageTile content={pageTileMap['savings-bonds']} images={images} />
                <div className={line} />
                <div className={sectionHeader}>TOOLS</div>
                <HomePageTile content={pageTileMap['currency-exchange-rates']} images={images} />
              </div>
            </Grid>
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default TopicsSection;
