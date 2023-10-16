import React, { useContext } from 'react';
import { ENV_ID } from 'gatsby-env-variables';
import { FormControlLabel, Switch } from '@material-ui/core';
import * as styles from './experimental-switch.module.scss';
import { siteContext } from '../../persist/persist';

const ExperimentalSwitch = () => {
  const isLowerEnvironment = ENV_ID !== 'production';
  const { showExperimentalFeatures, setShowExperimentalFeatures } = useContext(siteContext);

  const handleChange = () => {
    setShowExperimentalFeatures(!showExperimentalFeatures);
  };

  const switchComponent = <Switch size="small" checked={showExperimentalFeatures} onChange={handleChange} data-testid="switch" />;

  return isLowerEnvironment ? (
    <div data-testid="experimental-switch" className={styles.switchContainer}>
      <FormControlLabel className={styles.label} control={switchComponent} label="Toggle experimental features" />
    </div>
  ) : (
    <div>&nbsp;</div> // used for spacing in header in production environment
  );
};

export default ExperimentalSwitch;
