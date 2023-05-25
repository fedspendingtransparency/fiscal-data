import React, { useState } from 'react';
import {
  container,
  content,
  infoIcon,
  xMarkIcon
} from "./announcement-banner.module.scss";
import {faInfoCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const AnnouncementBanner = ({
  altStyle,
  children
}) => {
  const [visible, setVisible] = useState(true);
  const hideBanner = () => {
    setVisible(false);
  };

  const Banner = () => {
    return (
      <div className={`${container} bannerContainer`}
           style={altStyle}
           data-testid="bannerContainer"
      >
        <div className={`${content} bannerContent`}>
          <FontAwesomeIcon className={infoIcon} icon={faInfoCircle} />
          <div>
            {children}
          </div>
        </div>
        <div
          onClick={hideBanner}
          onKeyPress={hideBanner}
          tabIndex={0}
          role="button"
        >
          <FontAwesomeIcon className={xMarkIcon} icon={faXmark} />
        </div>
      </div>
    );
  }

    return (
      <>
        {visible ? <Banner /> : undefined}
      </>
    );
}

export default AnnouncementBanner;
