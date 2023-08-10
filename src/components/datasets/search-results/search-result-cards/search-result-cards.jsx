import React, { useEffect, useState } from "react";
import DatasetCard from '../../../dataset-card/dataset-card';
import * as styles from "./search-result-cards.module.scss";
import { PerformSort } from "../search-results-helper";
import { withWindowSize } from 'react-fns';
import {currentFontSize} from "../../../../utils/browser-font-size";

/*
  currentFontSize is divided by 16 because 16px is the standard (medium) browser font-size. That
   portion of the mathing below acts as a scalar for the standard card height of 337px.
*/
const cardHeight = Math.floor(337 * currentFontSize / 16)
  + Math.ceil(currentFontSize !== 16 ? currentFontSize * (currentFontSize / 16) : 0); // account for
// line wrapping

const gutter = {
    x: 2,
    y: Math.floor(14 * currentFontSize / 16) // scaling gutter with current font-size
};

const breakpoint = {
    desktop: 992,
    tablet: 600
};


const SearchResultCards = ({filteredDatasets, width, activeSort, allDatasets}) => {
    const [fauxIndex, setFauxIndex] = useState({});

    let cardsPerRow = 1,
        cardWidth = 100;

    const setCardPositionVars = () => {
        if (width > breakpoint.desktop) {
            // set for desktop
            cardsPerRow = 3;
            cardWidth = 32;
        } else if (width >= breakpoint.tablet && width < breakpoint.desktop) {
            // set for tablet
            cardsPerRow = 2;
            cardWidth = 49;
        }
        //otherwise the defaults are set to phone size
    }

    const updateSort = () => {
        const obj = {};

        PerformSort(activeSort, filteredDatasets);

        filteredDatasets.forEach((row, i) => {
            obj[row.name] = i;
        });

        setFauxIndex(obj);
    }

    const placeCard = (name) => {
        const i = fauxIndex[name] || 0;

        const x = (i % cardsPerRow) * (cardWidth + gutter.x);
        const y = Math.floor(i/cardsPerRow) * (cardHeight + gutter.y);

        return {
          left: `${x}%`,
          top: `${y}px`,
        };
    };


    const setContainerHeight = (count) => {
        return {
            height: `${Math.ceil(count/cardsPerRow) * (cardHeight + gutter.y)}px`
        }
    };

    setCardPositionVars();

    useEffect(() => {
        if (allDatasets.length) {
            updateSort();
        }

        allDatasets.forEach(ds => {
          ds.hidden = !filteredDatasets.some(s => s.datasetId === ds.datasetId);
        })
    }, [filteredDatasets]);

    useEffect(() => {
        updateSort()
    }, [activeSort]);


    return (
        <div className={styles.cardContainer}
             data-test-id="wrapper"
             style={setContainerHeight(filteredDatasets.length)}
        >
              {
                  allDatasets && allDatasets.map((dataset, i) => (
                      <div data-testid="cardPlacement"
                           className={
                             `${styles.cardPlacement} ${dataset.hidden ? styles.hiddenCard : ''}`
                           }
                           style={placeCard(dataset.name)}
                           key={i}
                      >
                          <DatasetCard dataset={dataset}
                                       context="Dataset Search Page"
                                       referrer="Dataset"
                          />
                      </div>
                  ))
              }
        </div>
    );
}

export default withWindowSize(SearchResultCards);
