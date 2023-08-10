import React from 'react'
import { Grid } from '@material-ui/core';
import { ChartPlaceholder } from
    '../../../explainer-helpers/national-deficit/national-deficit-helper';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightLong} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./afg-topic-section.module.scss";
import Analytics from "../../../../../utils/analytics/analytics";
import useGAEventTracking from "../../../../../hooks/useGAEventTracking";

export default function AfgTopicSection({
    heading,
    body,
    linkUrl,
    linkText,
    linkColor,
    image,
    imageAltText,
    eventNumber,
    citationClickPage,
    id
}) {

  const {gaEvent} = useGAEventTracking(eventNumber, citationClickPage);

  const onClickEventHandler = () => {
     if (eventNumber) {
      Analytics.event({
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }
  };

    return (
        <Grid classes={{ root: styles.topicSection }} container spacing={0} data-testid="topic-section" key={linkUrl}>
            <Grid item md classes={{ root: styles.textContainer }}>
                <h5 className={styles.topicHeading}>{heading}</h5>
                <p className={styles.body}>{body}</p>
                <a href={linkUrl}
                   style={{ color: linkColor, marginTop: '2rem' }} // TODO: Move marginTop to afgTopicsLink class
                   className={`${styles.link} afgTopicsLink`}
                   onClick={onClickEventHandler}
                   id={id}
                >
                  {linkText}
                  <FontAwesomeIcon icon={faArrowRightLong} title={"right arrow"} className={styles.arrow} />
                </a>
            </Grid>
            <Grid item md classes={{ root: styles.imageContainer }}>
                {image ? <img src={image} alt={imageAltText} /> : <ChartPlaceholder />}
            </Grid>
        </Grid>
    )
}
