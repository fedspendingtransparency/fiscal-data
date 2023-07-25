import React from 'react'
import * as styles from './hideLegendToggle.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

const HideLegendToggle = ({displayText, displayIcon, showToggle, onToggleLegend, selectedTab}) => {
    return (
        <React.Fragment>
            <div className={styles.toggleContainer} >
                {(selectedTab && showToggle) && (
                    <button className={styles.toggleButton} onClick={onToggleLegend} onKeyPress={onToggleLegend}>
                        <span>
                            <FontAwesomeIcon icon={displayIcon} 
                            className={displayIcon === faCrosshairs ? styles.selectColumnsIcon : styles.icon} 
                            size="1x" />
                            {displayText}
                        </span>
                    </button>
                )}
            </div>
        </React.Fragment>

    )
};
export default HideLegendToggle;
