import React from 'react'
import * as styles from './hideLegendToggle.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";

const HideLegendToggle = ({legend, showToggle, onToggleLegend, selectedTab}) => {
    return (
        <React.Fragment>
            {(selectedTab === 1 && showToggle) && (
                <button className={styles.toggleButton} onClick={onToggleLegend} onKeyPress={onToggleLegend}>
                    <span className={styles.buttonLabel}>
                        <FontAwesomeIcon icon={faSlidersH} className={styles.icon} size='1x' />
                        {legend ? "Hide Legend" : "Show Legend"}
                    </span>
                </button>
            )}
        </React.Fragment>
    )
};
export default HideLegendToggle;
