import React from 'react'
import { Grid } from '@material-ui/core';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { ChartPlaceholder } from '../../../../layouts/explainer/explainer-helpers/national-deficit/national-deficit-helper';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRightLong} from "@fortawesome/free-solid-svg-icons";
import * as styles from "./topic-section.module.scss";

export default function TopicSection({
    heading,
    body,
    linkUrl,
    linkText,
    linkColor,
    image
}) {
    return (
        <Grid className={styles.topicSection} container spacing={4}>
            <Grid item lg >
                <h5 className={styles.topicHeading}>{heading}</h5>
                <p className={styles.body}>{body}</p>
                <a href={linkUrl} style={{ color: linkColor, 'margin-top': '2rem' }} className={styles.link}>{linkText}   <FontAwesomeIcon icon={faRightLong} title={"right arrow"} /></a>
            </Grid>
            <Grid item lg>
                {image ? <img src={image} alt="" /> : <ChartPlaceholder />}
            </Grid>
        </Grid>
    )
}
