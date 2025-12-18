import React, { useEffect, useRef, useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Grid } from '@mui/material';
import HighlightedDatasets from './highlighted-datasets-config';
import { cardsContainer, cardWrapper, container } from './home-highlight-cards.module.scss';
import HomeHighlightCard from './home-highlight-card/home-highlight-card';

export const baseCollapsedStyle = {
  overflow: 'hidden',
};

const HomeHighlightCards = () => {
  // Get datasets
  // TODO: for continuity create page context using the highlighted-datasets.json to populate filter array
  const datasets = useStaticQuery(
    graphql`
      query {
        allDatasets(
          filter: { datasetId: { in: ["015-BFS-2014Q1-13", "015-BFS-2014Q3-065", "015-BFS-2014Q1-03", "015-BFS-2014Q3-056", "015-BFS-2014Q1-09"] } }
        ) {
          datasets: nodes {
            name
            datasetId
            slug
            tagLine
            apis {
              apiId
              endpoint
              dateField
              latestDate
              pathName
            }
          }
        }
      }
    `
  );

  const [highlights, setHighlights] = useState([]);

  const containerRef = useRef(null);

  const getHighlights = () => {
    const datasetData = datasets !== undefined ? datasets.allDatasets.datasets : [];
    const sortedTitles = HighlightedDatasets;

    return datasetData
      .flatMap(s => {
        const matched = sortedTitles.filter(t => t.datasetId === s.datasetId);
        return matched.map((u, i) => {
          return {
            ...s,
            title: u.title || '',
            data: u.data || {},
            displayOrder: u.displayOrder || i,
          };
        });
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  /**
   * Handles the resize on the window to update the tabIndex of the visible cards on the screen.
   * Only the collapsed view of the cards will have any effect as some cards may move in/out of
   * view depending on the viewport width.
   */

  useEffect(() => {
    const highlightsVals = getHighlights();
    setHighlights(highlightsVals);
  }, []);

  return (
    <div data-testid="highlight-cards-parent" className={container} ref={containerRef}>
      <Grid container className={cardsContainer} data-testid="cards-container">
        {highlights.map((dataset, i) => (
          <Grid className={cardWrapper} item xs={12} sm={6} xl={3} key={i}>
            <HomeHighlightCard cardId={`homepageCard-${i}`} className={cardWrapper} dataset={dataset} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomeHighlightCards;
