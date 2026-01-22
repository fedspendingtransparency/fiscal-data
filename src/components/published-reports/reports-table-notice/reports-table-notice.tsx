import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { container, errorContainer, icon, info, notShownBodyText, notShownHeading } from './reports-table-notice.module.scss';
import DtgTableApiError from '../../dtg-table/dtg-table-api-error/dtg-table-api-error';

interface iTableMessage {
  heading: string;
  bodyText: string;
  apiErrorMessage: boolean;
}

const ReportsTableNotice: FunctionComponent<iTableMessage> = ({ heading, bodyText, apiErrorMessage }) => {
  return apiErrorMessage ? (
    <div className={errorContainer}>
      <DtgTableApiError />
    </div>
  ) : (
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

export default ReportsTableNotice;
