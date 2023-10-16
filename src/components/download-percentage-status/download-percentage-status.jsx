import React from 'react';
import { CircularProgress } from '@material-ui/core';
import * as styles from './download-percentage-status.module.scss';

const DownloadPercentageStatus = ({ percentage, sticky, minimized }) =>
  minimized ? (
    <div className={styles.minimized}>{percentage}%</div>
  ) : (
    <div className={styles.container}>
      <CircularProgress value={100} className={styles.backgroundCircle} variant="determinate" />
      <CircularProgress value={percentage} className={styles.progressBar} variant="determinate" data-testid="progress-bar" />
      <div className={`${styles.percentage} ${sticky ? styles.stickyPercentage : ''}`} data-testid="percentage">
        {percentage}%
      </div>
    </div>
  );

export default DownloadPercentageStatus;
