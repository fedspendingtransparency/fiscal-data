import React, {Fragment} from 'react'
import { Link, navigate } from "gatsby"
import * as styles from './explainer-sub-nav.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouseChimney } from "@fortawesome/free-solid-svg-icons";

export default function ExplainerSubNav({ isShown }) {
    return (
        (isShown ? (
            <div id={styles.navContainer} data-testid="explainerSubNav">
                <ul className={[styles.navBlock]}>
                    <li className={[styles.navItem, styles.noverview, styles.nactive].join(' ')}>
                        <Link to='/americas-finance-guide/' className={styles.navLink} activeClassName={styles.active}>
                            <FontAwesomeIcon icon={faHouseChimney} className={styles.navIcon} />
                            <span className={styles.navLinkText}>Overview</span>
                        </Link>
                    </li>
                    <li className={[styles.frontChevron, styles.overview].join(' ')}></li>
                    <li className={[styles.backChevron, styles.revenue].join(' ')}></li>
                    <li className={[styles.navItem, styles.revenue].join(' ')}>
                        <Link to='/americas-finance-guide/government-revenue/' className={styles.navLink} activeClassName={styles.active}>
                            <span className={styles.navLinkText}>Revenue</span>
                        </Link>
                    </li>
                    <li className={[styles.frontChevron, styles.revenue].join(' ')}></li>
                    <li className={[styles.backChevron, styles.spending].join(' ')}></li>
                    <li className={[styles.navItem, styles.spending].join(' ')}>
                        <Link to='/americas-finance-guide/federal-spending/' className={styles.navLink} activeClassName={styles.active}>
                            <span className={styles.navLinkText}>Spending</span>
                        </Link>
                    </li>
                    <li className={[styles.frontChevron, styles.spending].join(' ')}></li>
                    <li className={[styles.backChevron, styles.deficit].join(' ')}></li>
                    <li className={[styles.navItem, styles.deficit].join(' ')}>
                        <Link to='/americas-finance-guide/national-deficit/' className={styles.navLink} activeClassName={styles.active}>
                            <span className={styles.navLinkText}>Deficit</span>
                        </Link>
                    </li>
                    <li className={[styles.frontChevron, styles.deficit].join(' ')}></li>
                    <li className={[styles.backChevron, styles.debt].join(' ')}></li>
                    <li className={[styles.navItem, styles.debt].join(' ')}>
                        <Link to='/americas-finance-guide/national-debt/' className={styles.navLink} activeClassName={styles.active}>
                            <span className={styles.navLinkText}>Debt</span>
                        </Link>
                    </li>

                </ul>
            </div>
        ) : (<Fragment></Fragment>)
        )
    )
}
