import React from 'react';
import { ENV_ID, LOWER_ENV_FEATURE_WHITELIST } from 'gatsby-env-variables';

export const isAllowedInContext = featureId => ENV_ID !== 'production' && LOWER_ENV_FEATURE_WHITELIST.includes(featureId);

/**
 *
 * @param children
 * @param featureId - Id specifying what experimental feature is whitelisted in the env file.
 * @returns {JSX.Element}
 */
const LowerEnvironmentFeature = ({ children, featureId }) => {
  const showFeature = isAllowedInContext(featureId);

  return (
    <>
      {showFeature ? (
        // feature is allowed to be shown in context
        <>{children}</>
      ) : null}
    </>
  );
};
export default LowerEnvironmentFeature;
