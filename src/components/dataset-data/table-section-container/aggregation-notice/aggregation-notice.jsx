import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { outer, container, infoBox, iconContainer, infoIcon, infoText } from './aggregation-notice.module.scss';
import { makeStyles } from '@material-ui/core/styles';

export const dataAggregationNotice = 'This data is aggregated by the given Time Period for the selected pivot option';

const useStyles = makeStyles(theme => ({
  iconColor: {
    '& path': {
      fill: '#00a5d4',
    },
  },
}));

const AggregationNotice = () => {
  const classes = useStyles();
  return (
    <div className={outer}>
      <div className={container}>
        <div className={infoBox}>
          <div className={iconContainer}>
            <FontAwesomeIcon icon={faInfoCircle} className={`${infoIcon} ${classes.iconColor}`} />
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
