import React from 'react';
import { icon, selectColumnsIcon, toggleButton, toggleContainer } from './hideLegendToggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons/faCrosshairs';

const HideLegendToggle = ({ displayText, displayIcon, showToggle, onToggleLegend, selectedTab, role }) => {
  return (
    <>
      <div className={toggleContainer} role={role}>
        {selectedTab && showToggle && (
          <button className={toggleButton} onClick={onToggleLegend}>
            <span>
              <FontAwesomeIcon icon={displayIcon} className={displayIcon === faCrosshairs ? selectColumnsIcon : icon} size="1x" />
              {displayText}
            </span>
          </button>
        )}
      </div>
    </>
  );
};
export default HideLegendToggle;
