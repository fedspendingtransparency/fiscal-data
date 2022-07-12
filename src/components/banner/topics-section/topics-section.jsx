import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBookOpen} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Grid } from "@material-ui/core"
import ExplainerTile from "./explainer-tile/explainer-tile";
import {
  tileContainer,
  sectionHeader,
  siteBannerHeader,
  topicsSectionContainer,
  line
} from "./topics-section.module.scss";
import {withWindowSize} from "react-fns";
import {breakpointLg} from "../../../variables.module.scss";
import {pxToNumber} from "../../../helpers/styles-helper/styles-helper";
import {pageTileMap} from "./explainer-tile/explainer-tile-helper";



export const TopicsSection = ({images, width}) => {
  const mainWidth = 8;
  const secondaryWidth = 4;

  return (
    <div className={topicsSectionContainer}>
      <div className={sectionHeader}>
        TOPICS
      </div>
      <h5 className={siteBannerHeader}>
        <FontAwesomeIcon icon={faBookOpen}/>
        <div>
          Your Guide to America’s Finances
        </div>
      </h5>
      <i>
        Fiscal Data presents the first of four concepts from Your Guide to America's Finances,
        which will be added in the coming months.
      </i>
      <div className={tileContainer}>
        <Grid container spacing={4}>
          <Grid item md={mainWidth}>
            <ExplainerTile content={pageTileMap['debt']}
                           images={images.allFile.topicsImages}
                           width={width}
            />
          </Grid>
          {width < pxToNumber(breakpointLg) ? <div className={line}/> : undefined}
          <Grid item md={secondaryWidth}>
            <ExplainerTile content={pageTileMap['deficit']}
                           images={images.allFile.topicsImages}
                           width={width}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
};

export default withWindowSize(TopicsSection);

