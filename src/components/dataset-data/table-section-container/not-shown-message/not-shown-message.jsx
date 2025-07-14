import React from 'react';
import { container, info, icon, notShownHeading, notShownBodyText } from './not-shown-message.module.scss';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotShownMessage = ({ heading, bodyText }) => {
  return (
    <div className={container} data-testid="container">
      <div className={info}>
        <div className={icon}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </div>
        <div>
          {heading && (
            <div className={notShownHeading} data-testid="heading">
              {heading}
            </div>
          )}
          <div className={notShownBodyText} data-testid="bodyText">
            {bodyText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotShownMessage;
