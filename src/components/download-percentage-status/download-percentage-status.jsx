import React from 'react';
import { CircularProgress } from '@material-ui/core';
import * as styles from './download-percentage-status.module.scss';
import {
  minimizedStyle,
  container,
  backgroundCircle,
  progressBar,
  percentageStyle,
  stickyPercentage,
} from './download-percentage-status.module.scss';

const DownloadPercentageStatus = ({ percentage, sticky, minimized }) =>
  minimized ? (
    <div className={minimizedStyle}>{percentage}%</div>
  ) : (
    <div className={container}>
      <CircularProgress value={100} className={backgroundCircle} variant="determinate" />
      <CircularProgress value={percentage} className={progressBar} variant="determinate" data-testid="progress-bar" />
      <div className={`${percentageStyle} ${sticky ? stickyPercentage : ''}`} data-testid="percentage">
        {percentage}%
      </div>
    </div>
  );

export default DownloadPercentageStatus;
