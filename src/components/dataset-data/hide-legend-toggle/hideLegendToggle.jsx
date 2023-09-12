import React from 'react'
import {
  selectColumnsIcon,
  icon,
  toggleContainer,
  toggleButton,
} from './hideLegendToggle.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrosshairs } from "@fortawesome/free-solid-svg-icons";

const HideLegendToggle = ({displayText, displayIcon, showToggle, onToggleLegend, selectedTab}) => {
  return (
    <>
      <div className={toggleContainer} >
        {(selectedTab && showToggle) && (
          <button className={toggleButton} onClick={onToggleLegend} onKeyPress={onToggleLegend}>
            <span>
              <FontAwesomeIcon
                icon={displayIcon}
                className={displayIcon === faCrosshairs ? selectColumnsIcon : icon}
                size="1x"
              />
              {displayText}
            </span>
          </button>
        )}
      </div>
    </>

  )
};
export default HideLegendToggle;
