import React from 'react';
import { selectColumnsIcon, icon, toggleButton } from './hideLegendToggle.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';

const HideLegendToggle = ({ displayText, displayIcon, showToggle, onToggleLegend, selectedTab, role }) => {
  return (
    <>
      {/*<div className={toggleContainer} role={role}>*/}
      {selectedTab && showToggle && (
        <button className={toggleButton} onClick={onToggleLegend} role={role}>
          <FontAwesomeIcon icon={displayIcon} className={displayIcon === faCrosshairs ? selectColumnsIcon : icon} size="1x" />
          {displayText}
        </button>
      )}
      {/*</div>*/}
    </>
  );
};
export default HideLegendToggle;
