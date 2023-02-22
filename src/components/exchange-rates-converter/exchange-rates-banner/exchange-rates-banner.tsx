import {
  bannerBackground,
  bannerText
} from './exchange-rates-banner.module.scss';
import React, {FunctionComponent} from "react";
import SocialShareDropdown from "../../social-share/social-share-dropdown/social-share-dropdown";
import {ISocialShareCopy} from "../../../models/ISocialShareCopy";
interface IExchangeRatesBanner {
  text: string;
  copy: ISocialShareCopy;
}
const ExchangeRatesBanner: FunctionComponent<IExchangeRatesBanner> = ({text, copy}) => {

  return (
    <>
      <div className={bannerBackground}>
        <div className={bannerText}>
          <h1>{text}</h1>
          <SocialShareDropdown copy={copy} pageName={""} />
        </div>
      </div>
    </>
  );
}

export default ExchangeRatesBanner;
