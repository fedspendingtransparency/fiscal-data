import React from 'react'
import { Grid } from '@material-ui/core';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { ChartPlaceholder } from '../../../../layouts/explainer/explainer-helpers/national-deficit/national-deficit-helper';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightLong} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./topic-section.module.scss";
import { style } from 'd3-selection';

export default function TopicSection({
    heading,
    body,
    linkUrl,
    linkText,
    linkColor,
    image,
    imageAltText
}) {

    return (
        <Grid classes={{ root: styles.topicSection }} container spacing={4} data-testid="topic-section">
            <Grid item lg classes={{ root: styles.textContainer }}>
                <h5 className={styles.topicHeading}>{heading}</h5>
                <p className={styles.body}>{body}</p>
                <a href={linkUrl} style={{ color: linkColor, marginTop: '2rem' }} className={styles.link}>{linkText}
                    <FontAwesomeIcon icon={faRightLong} title={"right arrow"} className={styles.arrow}/>
                </a>
            </Grid>
            <Grid item lg classes={{ root: styles.imageContainer }}>
                {image ? <img src={image} alt={imageAltText} /> : <ChartPlaceholder />}
            </Grid>
        </Grid>
    )
}
