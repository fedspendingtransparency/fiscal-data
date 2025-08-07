import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { overlay, loadingIcon } from './loading-indicator.module.scss';

interface ILoadingIndicator {
  showOverlay?: boolean;
  unstyled?: boolean;
}

const LoadingIndicator: FunctionComponent<ILoadingIndicator> = ({ showOverlay = false, unstyled = true }) => {
  return (
    <>
      {showOverlay && <div data-test-id="loading-overlay" className={overlay} />}
      <div data-testid="loadingSection" className={!unstyled ? loadingIcon : null}>
        <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
        Loading...
      </div>
    </>
  );
};

export default LoadingIndicator;
