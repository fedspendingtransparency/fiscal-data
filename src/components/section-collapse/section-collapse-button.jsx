import React, { useState } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";

// TODO: move shared button styles to a site-wide style variable or mixin
import * as DownloadButtonStyles from '../download-wrapper/download-button.module.scss';
import * as styles from '../api-quick-guide/api-quick-guide.module.scss';

const SectionCollapseButton = ({ handleToggle, sectionName }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleState = () => {
    setIsCollapsed(!isCollapsed);
    handleToggle(!isCollapsed);
  }

  return (
    <div className={DownloadButtonStyles.buttonContainer}>
      <button
        onClick={toggleState}
        id={`${sectionName}-collapse-button`}
        className={styles.toggleButton}
        data-testid="collapse-button"
      >
        <span data-testid="collapse-span" className={styles.buttonText}>{isCollapsed ? 'Show More' : 'Show Less'}</span>
        <div className={`${DownloadButtonStyles.icon} ${isCollapsed
          ? '' : DownloadButtonStyles.flipped}`}
        >
          <FontAwesomeIcon icon={faChevronDown} data-test-id="faChevronDown" />
        </div>
      </button>
    </div>
  );
}
export default SectionCollapseButton;
