import React, { useEffect, useState, useRef } from "react"
import { withWindowSize } from "react-fns"
import { graphql, useStaticQuery } from "gatsby"
import { Grid } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faAngleDoubleDown, faAngleDoubleUp, faSpinner} from "@fortawesome/free-solid-svg-icons"
import HighlightedDatasets from "./highlighted-datasets-config"
import {
  cardsContainer,
  cardWrapper,
  container,
  loading,
  toggleButton
} from "./home-highlight-cards.module.scss"
import Analytics from "../../utils/analytics/analytics"
import HomeHighlightCard from "./home-highlight-card/home-highlight-card"
import {currentFontSize} from "../../utils/browser-font-size";

export const baseCollapsedStyle = {
  overflow: 'hidden'
};

export const cardWidthRem = 16.25; /* Todo - Tied to the value seen in the scss. These need to
                                       be kept in sync until a better solution is realized. */
export const baseFontSize = 16; /* The first useEffect checks the user's root font size, so this
                                    is just a placeholder. */

const HomeHighlightCards = ({width}) => {

  // Get datasets
  // TODO: for continuity create page context using the highlighted-datasets.json
  //  to populate filter array
  const datasets = useStaticQuery(
    graphql`
      query {
        allDatasets(filter: {datasetId: {in: [
          "015-BFS-2014Q1-13",
          "015-BFS-2014Q3-065",
          "015-BFS-2014Q1-03",
          "015-BFS-2014Q3-056",
          "015-BFS-2014Q1-09"
        ]}}) {
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
      }`
  );
  const [expanded, setExpanded] = useState(false);
  const [visibleCardsNum, setVisibleCardsNum] = useState(1); /* Set to the lowest number
                                                                         (mobile) to prevent
                                                                         unnecessarily loading api
                                                                         data if no interaction
                                                                         from user. */
  const [highlights, setHighlights] = useState([]);
  const [expandedStyle, setExpandedStyle] = useState(baseCollapsedStyle);
  const [cardWidth, setCardWidth] = useState(baseFontSize * cardWidthRem); /* Default
                                                                                      16 * 16.25
                                                                                      = 260px */
  let previousWidth, debounce;

  const containerRef = useRef(null);

  const handleToggle = () => {
    Analytics.event({
      category: 'Homepage Cards',
      action: expanded ? 'Show Less' : 'Show More'
    });
    setExpanded((prevState) => !prevState);
    setExpandedStyle((prevState) =>
      Object.keys(prevState).length === 0 ? baseCollapsedStyle : {});
  };

  const getHighlights = () => {
    const datasetData = datasets !== undefined
      ? datasets.allDatasets.datasets
      : [];
    const sortedTitles = HighlightedDatasets;

    return datasetData.flatMap(s => {
      const matched = sortedTitles.filter(t => t.datasetId === s.datasetId);
      return matched.map((u, i) => {
        return {
          ...s,
          title: u.title || '',
          data: u.data || {},
          displayOrder: u.displayOrder || i
        };
      });
    }).sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
  };

  const buttonContent = expanded ? (
    <>
      <FontAwesomeIcon icon={faAngleDoubleUp} />
      <span>Show Less</span>
    </>
  ) : (
    <>
      <span>Show More</span>
      <FontAwesomeIcon icon={faAngleDoubleDown} />
    </>
  );

  const visibleCardsSetter = (onload = false) => {
    const allCardsNum = highlights.length;
    // Show all cards if we're currently not doing so and expanded === true.
    if (expanded){
      if(visibleCardsNum < allCardsNum) {
        setVisibleCardsNum(highlights.length);
      }
    } else {
      const containerWidth = Math.min(containerRef.current.clientWidth, 1140);
      const numCards = Math.max(Math.floor(containerWidth / cardWidth), 1);
      setVisibleCardsNum(numCards);
    }
  };

  /**
   * Handles the resize on the window to update the tabIndex of the visible cards on the screen.
   * Only the collapsed view of the cards will have any effect as some cards may move in/out of
   * view depending on the viewport width.
   */
  const handleResize = () => {
    if (previousWidth === window.innerWidth) {
      return;
    }

    if (debounce) {
      clearTimeout(debounce);
    }

    previousWidth = window.innerWidth;

    debounce = setTimeout(visibleCardsSetter, 200);
  };


  useEffect(() => {
    visibleCardsSetter();
  }, [expanded, cardWidth]);

  useEffect(() => {
    const onload = true;
    const highlightsVals = getHighlights();
    setHighlights(highlightsVals);
    const cardSize = cardWidthRem * currentFontSize;
    setCardWidth(cardSize);
    visibleCardsSetter(onload);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div data-testid="highlight-cards-parent" className={container} ref={containerRef}>
        {highlights.length ?
          <Grid container
                className={cardsContainer}
                style={expandedStyle}
                data-testid="cards-container"
          >
            {highlights.filter((d, i) => i < visibleCardsNum).map((dataset, i) => (
              <Grid className={cardWrapper} item xs={12} sm={6} xl={3} key={i}>
                <HomeHighlightCard
                  cardId={`homepageCard-${i}`}
                  className={cardWrapper}
                  hidden={i > (visibleCardsNum - 1)}
                  dataset={dataset}
                />
              </Grid>
            ))}
          </Grid>
          :
          <div className={loading} data-testid="highlight-cards-spinner">
            <FontAwesomeIcon icon={faSpinner} spin pulse />
          </div>
        }
      <button
        onClick={handleToggle}
        className={toggleButton}
        data-testid="collapse-button"
      >
        {buttonContent}
      </button>
    </div>
  )
};

export default withWindowSize(HomeHighlightCards);
