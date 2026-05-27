import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { container, icon, info, notShownBodyText, notShownHeading } from './table-notice.module.scss';

interface iTableMessage {
  heading: string;
  bodyText: string;
}

const TableNotice: FunctionComponent<iTableMessage> = ({ heading, bodyText }) => {
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

export default TableNotice;
