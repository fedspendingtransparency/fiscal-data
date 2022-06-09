import React, { useState } from 'react';
import {
  container,
  bannerText,
  bannerContent,
  infoIcon,
  xIcon,
  hide
} from "./announcement-banner.module.scss";
import {faInfoCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const AnnouncementBanner = ({
  announcementText,
  containerClass
}) => {
  const [open, setOpen] = useState(true)
  const onClick = (e) => {
    if (e.key === undefined || e.key === 'Enter') {
      // e.stopPropagation();
      setOpen(false);
    }
  };

  return (
    <div className={open ? undefined : hide}>
    <div className={containerClass ? containerClass : container} hidden={!open}>
      <div className={bannerContent}>
        <div className={bannerText}>
          <FontAwesomeIcon className={infoIcon} icon={faInfoCircle} />
          <p>
            {announcementText}
          </p>
        </div>
        <div
          onClick={onClick}
          role="button"
        >
          <FontAwesomeIcon className={xIcon} icon={faXmark} />
        </div>
      </div>
    </div>
    </div>
  );
}

export default AnnouncementBanner;
