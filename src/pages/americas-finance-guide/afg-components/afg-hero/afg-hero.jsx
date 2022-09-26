import React, { useEffect, useState, useRef } from 'react'
import * as styles from './afg-hero.module.scss'
import { Box } from "@material-ui/core"
import { useWindowSize } from "../../../../hooks/windowResize"
import {
    explainerAnalyticsLabelMap,
    explainerSocialShareMap,
} from "../../../../layouts/explainer/explainer-helpers/explainer-helpers"
import SocialShare from "../../../../layouts/explainer/social-share/social-share"

export default function AfgHero() {
    const [isMobile, setIsMobile] = useState(false)
    const [width, height] = useWindowSize()
    const [containerHeight, setContainerHeight] = useState(765)
    const pageName = "americas-finance-guide"
    const breakpoint = {
        desktop: 1015,
        tablet: 600,
    }

    const refSocialShare = useRef(0);    

    useEffect(() => {
        const isMobile = window.innerWidth < breakpoint.desktop
        if (isMobile) {
            setIsMobile(true)
        } else {
            setIsMobile(false)
        }
        
        setContainerHeight(refSocialShare.current.offsetTop + 450)
    }, [width, height, containerHeight])


    return (
        <div className={styles.heroContainer} style={{height: `${containerHeight}px`}} data-testid="afg-hero">
            <div className={styles.heroGrayBox}></div>
            <div className={styles.heroImageBox} aria-label="Statue of Liberty">
                <h3 className={styles.heroQuote}>
                    “A regular Statement and Account of the Receipts and Expenditures of all public Money shall be published from time to time.”
                </h3>
                <p className={styles.heroCitation}>U.S. Constitution, Article 1, Section 9</p>
            </div>
            <div className={styles.heroWhiteBox} >
                <h4 className={styles.heroGuideText}>YOUR GUIDE TO AMERICA’S FINANCES</h4>
                <h1 className={styles.heroHeading}>How much money has the federal government collected and spent so far in fiscal year 2022?</h1>
                <div className={styles.heroSocialShare} ref={refSocialShare}>
                    <SocialShare
                        title={explainerSocialShareMap[pageName].title}
                        description={explainerSocialShareMap[pageName].description}
                        body={explainerSocialShareMap[pageName].body}
                        emailSubject={explainerSocialShareMap[pageName].emailSubject}
                        emailBody={explainerSocialShareMap[pageName].emailBody}
                        url={explainerSocialShareMap[pageName].url}
                        image={explainerSocialShareMap[pageName].image}
                        pageName={explainerAnalyticsLabelMap[pageName]}
                        orientation={"horizontal"}
                    />
                </div>
            </div>

        </div>
    )
}
