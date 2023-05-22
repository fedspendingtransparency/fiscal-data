import React from "react";
import SiteHeader from "../site-header/site-header";
import SiteFooter from "../site-footer/site-footer";

export const preProdEnvMsg =
  'Loading metadata and data from endpoints in pre-production environment.';

const SiteLayout = ({ children, isPreProd, glossaryEvent, glossaryEventHandler }) => {
  let lowerEnvMsg;

  if (isPreProd) {
    lowerEnvMsg = preProdEnvMsg;
  }

  return (
    <div>
        <SiteHeader lowerEnvMsg={lowerEnvMsg} glossaryEvent={glossaryEvent} glossaryEventHandler={glossaryEventHandler} />
          {children}
        <SiteFooter />
    </div>
  )
};

export default SiteLayout;
