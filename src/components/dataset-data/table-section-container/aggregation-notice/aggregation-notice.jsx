import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { container, iconContainer, infoBox, infoIcon, infoText, outer } from './aggregation-notice.module.scss';

export const dataAggregationNotice = 'This data is aggregated by the given Time Period for the selected pivot option';

const AggregationNotice = () => {
  return (
    <div className={outer}>
      <div className={container}>
        <div className={infoBox}>
          <div className={iconContainer}>
            <FontAwesomeIcon icon={faInfoCircle} className={infoIcon} style={{ color: '#00a5d4' }} />
          </div>
          <div className={infoText} data-testid="message-text">
            {dataAggregationNotice}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AggregationNotice;
