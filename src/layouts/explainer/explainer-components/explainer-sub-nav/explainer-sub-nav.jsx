import React from 'react'
import { Link, navigate } from "gatsby"
import * as styles from './explainer-sub-nav.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHouseChimney} from "@fortawesome/free-solid-svg-icons";

export default function ExplainerSubNav() {

    const clickHandler = (event) => {
        console.log(event.target.innerText)
        let link = '/';

        switch (event.target.innerText) {
            case "Overview":
                link = '/americas-finance-guide/'
                break;
            case "Revenue":
                link = '/americas-finance-guide/government-revenue/'
                break;
            case "Spending":
                link = '/americas-finance-guide/federal-spending/'
                break;
            case "Deficit":
                link = '/americas-finance-guide/national-deficit/'
                break;
            case "Debt":
                link = '/americas-finance-guide/national-debt/'
                break;
            default:
                break;
        }

        navigate(link);
    };

        //onClick={clickHandler}
                    //</ul>onKeyDown={clickHandler}>
    return (
        <div id={styles.navContainer}>
            <ul className={[styles.navBlock]}>
                <li className={[styles.navItem, styles.noverview, styles.nactive].join(' ')}>
                    
                    <Link to='/americas-finance-guide/' className={styles.navLink}><FontAwesomeIcon icon={faHouseChimney} className={styles.navIcon} /> Overview</Link>
                </li>
                <li className={[styles.frontChevron, styles.overview].join(' ')}></li>
                <li className={[styles.backChevron, styles.revenue].join(' ')}></li>
                <li className={[styles.navItem, styles.revenue].join(' ')}>
                    Revenue</li>
                <li className={[styles.frontChevron, styles.revenue].join(' ')}></li>
                <li className={[styles.backChevron, styles.spending].join(' ')}></li>
                <li className={[styles.navItem, styles.spending].join(' ')}>
                    Spending</li>
                <li className={[styles.frontChevron, styles.spending].join(' ')}></li>
                <li className={[styles.backChevron, styles.deficit].join(' ')}></li>
                <li className={[styles.navItem, styles.deficit].join(' ')}>
                    Deficit</li>
                <li className={[styles.frontChevron, styles.deficit].join(' ')}></li>
                <li className={[styles.backChevron, styles.debt].join(' ')}></li>
                <li className={[styles.navItem, styles.debt].join(' ')}>
                    Debt</li>

            </ul>
        </div>
    )
}
