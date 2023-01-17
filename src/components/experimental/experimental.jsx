import React, { useContext } from 'react';
import { EXPERIMENTAL_WHITELIST, ENV_ID } from "gatsby-env-variables";
import { siteContext } from '../persist/persist';

export const isAllowedInContext = (featureId) => (
  ENV_ID !== 'production' && EXPERIMENTAL_WHITELIST.includes(featureId)
);

/**
 *
 * @param children
 * @param featureId - Id specifying what experimental feature is whitelisted in the env file.
 * @param exclude - When true, exclude this content. This helps when swapping out existing prod features with experimental features.
 * @returns {JSX.Element}
 */
const Experimental = ({ children, featureId, exclude }) => {
  const isAllowed = isAllowedInContext(featureId);
  const { showExperimentalFeatures } = useContext(siteContext);

  return <>
      {
        (showExperimentalFeatures && isAllowed)
          ? (
              // feature is allowed to be shown in context
              !exclude ? <>{children}</> : null
            )
          : (
              // show the default (non-experimental) feature
              exclude ? <>{children}</> : null
            )
      }
         </>
};
export default Experimental;
