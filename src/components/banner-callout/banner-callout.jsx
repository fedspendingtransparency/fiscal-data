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

const BannerCallout = ({ bannerCallout, bannerType = 'info', width}) => {
    const currentCallout = calloutConfig[bannerCallout]?.copy;

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

    if (currentCallout) {
        return (
            <div className={classNames([banner, styleConfig.classname])} data-testid="banner" style={{width: width}}>
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
