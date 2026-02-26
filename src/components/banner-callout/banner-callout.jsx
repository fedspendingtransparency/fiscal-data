import React from 'react';
import {
  altBannerText,
  altInfoColor,
  banner,
  calloutText,
  icon,
  infoBanner,
  infoBannerYellow,
  sideTab,
  warningBanner,
  warningBannerXR,
} from './banner-callout.module.scss';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { calloutConfig } from './banner-callout-helper';
import InfoTip from '../info-tip/info-tip';
import { withWindowSize } from 'react-fns';

const BannerCallout = ({ bannerCallout, bannerType = 'info', width }) => {
  const currentCallout = calloutConfig[bannerCallout?.banner]?.copy;
  const infoTip = calloutConfig[bannerCallout?.banner]?.infoTip;
  const today = new Date().getTime();

  const endDate = bannerCallout?.endDate ? new Date(bannerCallout?.endDate).getTime() : null;
  const startDate = bannerCallout?.startDate ? new Date(bannerCallout?.startDate).getTime() : today;
  const altBanner = bannerCallout?.altBanner;

  const bannerMap = {
    info: {
      classname: infoBanner,
      icon: faCircleInfo,
    },
    infoYellow: {
      classname: infoBannerYellow,
      icon: faCircleInfo,
    },
    warning: {
      classname: warningBanner,
      icon: faTriangleExclamation,
    },
    warningXR: {
      classname: warningBannerXR,
      icon: faTriangleExclamation,
    },
  };

  const styleConfig = bannerMap[bannerType];

  if (currentCallout && today >= startDate && (endDate === null || today < endDate)) {
    if (altBanner) {
      return (
        <div
          className={classNames([banner, altInfoColor, infoBanner])}
          style={{ paddingRight: calloutConfig[bannerCallout.banner]?.customSideMargin }}
          data-testid="banner"
        >
          <span className={classNames([calloutText, altBannerText])} style={{ margin: calloutConfig[bannerCallout.banner]?.customTextMargin }}>
            {!infoTip && <FontAwesomeIcon className={icon} icon={styleConfig.icon} />}
            <div>
              {currentCallout}
              {infoTip && (
                <InfoTip width={width} hover iconStyle={{ color: '#666666', width: '15px', height: '15px' }}>
                  {infoTip}
                </InfoTip>
              )}
            </div>
          </span>
        </div>
      );
    } else {
      return (
        <div
          className={classNames([banner, styleConfig.classname])}
          style={{ paddingRight: calloutConfig[bannerCallout.banner]?.customSideMargin }}
          data-testid="banner"
        >
          <div className={sideTab} style={{ marginRight: calloutConfig[bannerCallout.banner]?.customSideMargin }} />
          <span className={calloutText} style={{ margin: calloutConfig[bannerCallout.banner]?.customTextMargin }}>
            {!infoTip && <FontAwesomeIcon className={icon} icon={styleConfig.icon} />}
            <div>
              {currentCallout}
              {infoTip && (
                <InfoTip width={width} hover iconStyle={{ color: '#666666', width: '15px', height: '15px' }}>
                  {infoTip}
                </InfoTip>
              )}
            </div>
          </span>
        </div>
      );
    }
  } else {
    return null;
  }
};

export default withWindowSize(BannerCallout);
