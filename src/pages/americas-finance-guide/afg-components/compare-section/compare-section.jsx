import React from 'react'
import { Grid } from '@material-ui/core';
import * as styles from './compare-section.module.scss'
import AfgIcon from '../afg-icon/afg-icon';
import { faCoins, faHandHoldingDollar, faChartArea, faMagnifyingGlassDollar } from "@fortawesome/free-solid-svg-icons";

export default function CompareSection()
{
    const subSections = [{
        heading: ['In YYYY the federal government ', <span style={{ color: '#0a2f5a' }}>collected</span>, ' $XX.X'],
        body: 'The primary source of revenue for the U.S. government in {YYYY (prior fiscal year)} was {Top Revenue Category}. Revenue collected by the U.S. government is used to fund a variety of goods, programs, and services to support the American public and pay interest incurred from borrowing.',
        faIcon: faCoins ,
        mainColor: '#0a2f5a'
    },
    {
        heading: ['In {YYYY (prior fiscal year)}, the federal government ', <span style={{ color: "#0a2f5a" }}>spent</span>, ' {$XX.X trillion (prior year-end spending)}'],
        body: 'Federal government spending pays for everything from Social Security and Medicare to military equipment, highway maintenance, building construction, research, and education. In {YYYY (prior fiscal year)}, the federal government spent the most on {Top Spending Category}. ',
        faIcon: faHandHoldingDollar ,
        mainColor: '#00766c'
    },
    {
        heading: ['In {YYYY (prior fiscal year)}, the federal government spent {$XX.X trillion (prior year-end deficit)} more than it collected, resulting in a ' ,<span style={{ color: '#b3532d' }}>deficit.</span>],
        body: 'To pay for government programs while operating under a deficit, the federal government borrows money by selling U.S. Treasury bonds, bills, and other securities. The national debt is the accumulation of this borrowing along with associated interest owed to investors who purchased these securities. In {YYYY (prior FY)}, the national deficit {increased/decreased} by {difference between $XX.X trillion (prior FY year-end deficit) and $XX.X trillion (two FY prior year-end deficit)} compared to {YYYY (two FY prior)}. ',
        faIcon: faChartArea ,
        mainColor: '#b3532d'
    },
    {
        heading: ['At the end of {YYYY (prior FY)} the government had {$XX.X (total year-end debt)}, in federal ' ,<span style={{ color: '#b3532d' }}>debt.</span>],
        body: 'The national debt enables the federal government to pay for important programs and services for the American public. In {YYYY (prior FY)}, the national debt {increased/decreased} by {difference between $XX.X trillion (prior FY year-end debt) and $XX.X trillion (two FY prior year-end debt)} compared to {YYYY (two FY prior)}.',
        faIcon: faMagnifyingGlassDollar ,
        mainColor: '#4a0072'
    }]

    return (
        <div className={styles.compareSection} data-testid="compare-section">
            <h3 className={styles.heading}>How did these totals compare to YYYY year-end? </h3>
            <Grid className="comparisonGrid" container spacing={4}>
                {subSections.map((s) => (
                    <React.Fragment key={s.mainColor} >
                        <Grid item md={1} >
                            <AfgIcon faIcon={s.faIcon} backgroundColor={s.mainColor} />
                        </Grid>
                        <Grid item md={5} >
                            <h5 className={styles.subHeading}>{s.heading}</h5>
                            <div className={styles.body}>{s.body}</div>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </div>

    )
}
