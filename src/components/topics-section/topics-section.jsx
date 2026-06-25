import React from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePageTile from './homepage-tile/homepage-tile';
import {
  insightsSectionContainer,
  line,
  sectionHeader,
  tileContainer,
  topicsGrid,
  topicsSectionContainer,
  featuredContentLine,
} from './topics-section.module.scss';
import { breakpointLg, breakpointMd } from '../../variables.module.scss';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { pageTileMap } from './homepage-tile/homepage-tile-helper';
import Experimental from '../experimental/experimental';
import { useWindowSize } from 'usehooks-ts';

export const TopicsSection = ({ images }) => {
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

  const featuredContent = (
    <Experimental featureId="featured-content">
      <div className={sectionHeader}>FEATURED CONTENT</div>
      <HomePageTile content={pageTileMap['featured-content']} images={images} rightTile />
      <div className={line} />
      <HomePageTile content={pageTileMap['historic-data-announcement']} images={images} rightTile />
      <div className={featuredContentLine} />
    </Experimental>
  );
  const featuredTopics = (
    <>
      <div className={sectionHeader}>FEATURED TOPICS</div>
      <HomePageTile content={pageTileMap['state-and-local-government-series']} images={images} rightTile />
      <div className={line} />
      <HomePageTile content={pageTileMap['interest-expense']} images={images} rightTile />
      <div className={line} />
      <HomePageTile content={pageTileMap['savings-bonds']} images={images} rightTile />
    </>
  );
  const tools = (
    <>
      <div className={featuredContentLine} />
      <div className={sectionHeader}>TOOLS</div>
      <HomePageTile content={pageTileMap['currency-exchange-rates']} layout="two-col" images={images} />
    </>
  );

  const explainerTiles = ['revenue', 'spending', 'deficit', 'debt'];
  const { width } = useWindowSize();
  const isMobile = width < pxToNumber(breakpointLg);

  return (
    <div className={topicsSectionContainer} data-testid="topics-section">
      <div className={tileContainer}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={4} className={topicsGrid}>
            <Grid size={{ lg: mainWidth }}>
              <Stack>
                <div className={sectionHeader}>AMERICA’S FINANCE GUIDE</div>
                <HomePageTile content={pageTileMap['americas-finance-guide']} images={images} />
                {explainerTiles.map(tile => {
                  return (
                    <React.Fragment key={tile}>
                      <div className={line} />
                      <HomePageTile content={pageTileMap[tile]} images={images} layout="two-col" explainerTile />
                    </React.Fragment>
                  );
                })}
              </Stack>
              {isMobile && (
                <>
                  {featuredContent}
                  {featuredTopics}
                  {tools}
                </>
              )}
              {!isMobile && tools}
            </Grid>
            {!isMobile && (
              <Grid container size={{ lg: secondaryWidth }}>
                <div className={insightsSectionContainer}>
                  {featuredContent}
                  {featuredTopics}
                </div>
              </Grid>
            )}
          </Grid>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default TopicsSection;
