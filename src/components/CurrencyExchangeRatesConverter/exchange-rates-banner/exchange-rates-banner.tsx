import {
  bannerBackground,
  bannerText
} from './exchange-rates-banner.module.scss';
import React, {FunctionComponent} from "react";
import SocialShareDropdown from "../../social-share/social-share-dropdown/social-share-dropdown";
interface IExchangeRatesBanner {
  text: string,
}
const ExchangeRatesBanner: FunctionComponent<IExchangeRatesBanner> = ({text}) => {
  return (
    <>
      <div className={bannerBackground}>
        <div className={bannerText}>
          <h1>{text}</h1>
          <SocialShareDropdown />
        </div>
      </div>
    </>
  );
}

export default ExchangeRatesBanner;
