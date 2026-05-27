import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';

// TODO: move shared button styles to a site-wide style variable or mixin
import { buttonContainer, flipped, icon } from '../download-wrapper/download-button.module.scss';
import { buttonText, toggleButton } from '../api-quick-guide/api-quick-guide.module.scss';

const SectionCollapseButton = ({ handleToggle, sectionName }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleState = () => {
    setIsCollapsed(!isCollapsed);
    handleToggle(!isCollapsed);
  };

  return (
    <div className={buttonContainer}>
      <button onClick={toggleState} id={`${sectionName}-collapse-button`} className={toggleButton} data-testid="collapse-button">
        <span data-testid="collapse-span" className={buttonText}>
          {isCollapsed ? 'Show More' : 'Show Less'}
        </span>
        <div className={`${icon} ${isCollapsed ? '' : flipped}`}>
          <FontAwesomeIcon icon={faChevronDown} data-test-id="faChevronDown" />
        </div>
      </button>
    </div>
  );
};
export default SectionCollapseButton;
