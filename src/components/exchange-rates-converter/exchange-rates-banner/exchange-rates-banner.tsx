import {
  bannerBackground,
  bannerText
} from './exchange-rates-banner.module.scss';
import React, {FunctionComponent} from "react";
import SocialShareDropdown from "../../social-share/social-share-dropdown/social-share-dropdown";
import {IExchangeRatesBanner} from "../../../models/IExchangeRatesBanner";

const ExchangeRatesBanner: FunctionComponent<IExchangeRatesBanner> = ({text, copy}) => {

  return (
    <>
      <div className={bannerBackground}>
        <div className={bannerText}>
          <h1>{text}</h1>
          <SocialShareDropdown copy={copy} pageName={"Exchange Rates Converter"} />
        </div>
      </div>
    </>
  );
}

export default ExchangeRatesBanner;
