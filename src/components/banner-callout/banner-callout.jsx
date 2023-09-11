import React from 'react';
import {
  banner,
  infoBanner,
  warningBanner,
  sideTab,
  calloutText,
  icon,
} from './banner-callout.module.scss';
import { faCircleInfo, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { calloutConfig } from './banner-callout-helper';

const BannerCallout = ({ bannerCallout, bannerType = 'info'}) => {
  const currentCallout = calloutConfig[bannerCallout?.banner]?.copy;

  const today = new Date().getTime();
  
  const endDate = bannerCallout?.endDate ? new Date(bannerCallout?.endDate).getTime() : null;
  const startDate = bannerCallout?.startDate ? new Date(bannerCallout?.startDate).getTime() : today;

    const bannerMap = {
      info: {
        classname: infoBanner,
        icon: faCircleInfo,
      },
      warning: {
        classname: warningBanner,
        icon: faTriangleExclamation,
      },
    }

    const styleConfig = bannerMap[bannerType];

    if (currentCallout && (today >= startDate && (endDate === null || today < endDate))) {
        return (
            <div className={classNames([banner, styleConfig.classname])} data-testid="banner" >
                <div className={sideTab} style={{marginRight: calloutConfig[bannerCallout]?.customMargin}} />
                <span className={calloutText}>
                    <FontAwesomeIcon className={icon} icon={styleConfig.icon} />
                    <div>
                      {currentCallout}
                    </div>
                </span>
            </div>
        );
    } else {
        return null;
    }
}

export default BannerCallout;
