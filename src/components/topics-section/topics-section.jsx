import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpen } from "@fortawesome/free-solid-svg-icons"
import React from "react"
import { createTheme, Grid, ThemeProvider } from "@material-ui/core"
import ExplainerTile from "./explainer-tile/explainer-tile"
import {
  tileContainer,
  sectionHeader,
  topicsSectionHeader,
  topicsSectionContainer,
  line,
} from "./topics-section.module.scss"
import { withWindowSize } from "react-fns"
import { breakpointLg } from "../../variables.module.scss"
import { pxToNumber } from "../../helpers/styles-helper/styles-helper"
import { pageTileMap } from "./explainer-tile/explainer-tile-helper"

export const TopicsSection = ({ images, width }) => {
  const mainWidth = 8
  const secondaryWidth = 4

  const theme = createTheme({
    breakpoints: {
      values: {
        lg: 992,
      },
    },
  })

  return (
    <div className={topicsSectionContainer}>
      <div className={sectionHeader}>TOPICS</div>
      <h5 className={topicsSectionHeader}>
        <FontAwesomeIcon icon={faBookOpen} />
        <div>Your Guide to America’s Finances</div>
      </h5>
      <i>
        Fiscal Data presents the third of four concepts from Your Guide to
        America’s Finances, which will be added in the coming months.
      </i>
      <div className={tileContainer}>
        <ThemeProvider theme={theme}>
          <Grid container spacing={4}>
            <Grid item lg={mainWidth}>
              <ExplainerTile
                content={pageTileMap["americas-finance-guide"]}
                images={images}
                width={width}
              />
              <ExplainerTile
                content={pageTileMap["revenue"]}
                images={images}
                width={width}
              />
            </Grid>
            {width < pxToNumber(breakpointLg) ? (
              <div className={line} />
            ) : (
              undefined
            )}
            <Grid item lg={secondaryWidth}>
              <ExplainerTile
                content={pageTileMap["spending"]}
                images={images}
                width={width}
              />
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
  )
}

export default withWindowSize(TopicsSection)
