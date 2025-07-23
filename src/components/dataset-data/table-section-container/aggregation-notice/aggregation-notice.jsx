import React from 'react';
import { container, iconContainer, infoBox, infoText, outer } from './aggregation-notice.module.scss';
// import { makeStyles } from '@material-ui/core/styles';

export const dataAggregationNotice = 'This data is aggregated by the given Time Period for the selected pivot option';

// const useStyles = makeStyles(theme => ({
//   iconColor: {
//     '& path': {
//       fill: '#00a5d4',
//     },
//   },
// }));

const AggregationNotice = () => {
  const classes = useStyles();
  return (
    <div className={outer}>
      <div className={container}>
        <div className={infoBox}>
          <div className={iconContainer}>{/*<FontAwesomeIcon icon={faInfoCircle} className={`${infoIcon} ${classes.iconColor}`} />*/}</div>
          <div className={infoText} data-testid="message-text">
            {dataAggregationNotice}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AggregationNotice;
