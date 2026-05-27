import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ILoadingIndicator {
  overlayClass?: string;
  loadingClass?: string;
}

const LoadingIndicator: FunctionComponent<ILoadingIndicator> = ({ overlayClass = false, loadingClass = false }) => {
  return (
    <>
      {overlayClass && <div data-test-id="loading-overlay" className={overlayClass ? overlayClass : null} />}
      <div data-testid="loadingSection" className={loadingClass ? loadingClass : null}>
        <FontAwesomeIcon data-testid="loadingIcon" icon={faSpinner as IconProp} spin pulse />
        Loading...
      </div>
    </>
  );
};

export default LoadingIndicator;
