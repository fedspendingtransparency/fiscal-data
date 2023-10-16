import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import * as styles from './aggregation-notice.module.scss';
import { makeStyles } from '@material-ui/core/styles';

export const dataAggregationNotice = 'This data is aggregated by the given Time Period for the ' + 'selected pivot option';

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
    <div className={styles.outer}>
      <div className={styles.container}>
        <div className={styles.infoBox}>
          <div className={styles.iconContainer}>
            <FontAwesomeIcon icon={faInfoCircle} className={`${styles.infoIcon} ${classes.iconColor}`} />
          </div>
          <div className={styles.infoText} data-testid="message-text">
            {dataAggregationNotice}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AggregationNotice;
