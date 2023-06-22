import React from 'react'
import * as styles from './hideLegendToggle.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HideLegendToggle = ({displayText, displayIcon, showToggle, onToggleLegend, selectedTab}) => {
    return (
        <React.Fragment>
            {(selectedTab && showToggle) && (
                <button className={styles.toggleButton} onClick={onToggleLegend} onKeyPress={onToggleLegend}>
                    <span className={styles.buttonLabel}>
                        <FontAwesomeIcon icon={displayIcon} className={styles.icon} size="1x" />
                        {displayText}
                    </span>
                </button>
            )}
        </React.Fragment>
    )
};
export default HideLegendToggle;
