import React, { useState } from 'react';
import {
  bannerContainer,
  bannerContent,
  infoIcon,
  xMarkIcon,
  hide
} from "./announcement-banner.module.scss";
import {faInfoCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const AnnouncementBanner = ({
  altStyle,
  children
}) => {
  const [open, setOpen] = useState(true);
  const hideBanner = () => {
      setOpen(false);
  };

    return (
      <div className={open ? undefined : hide}>
        <div className={bannerContainer}
             style={altStyle}
        >
          <div className={bannerContent}>
            <FontAwesomeIcon className={infoIcon} icon={faInfoCircle} />
            {children}
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
      </div>
    );
}

export default AnnouncementBanner;
