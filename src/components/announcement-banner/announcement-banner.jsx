import React from "react";
import {
  container,
  bannerText,
  banner,
  bannerIcon
} from "./announcement-banner.module.scss";
import {faInfoCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const AnnouncementBanner = ({
  announcementText,
  containerClass
}) => {

  return (
    <div className={containerClass ? containerClass : container}>
      <div className={banner}>
        <div className={bannerText}>
          <FontAwesomeIcon className={bannerIcon} icon={faInfoCircle} />
          <p>
            {announcementText}
          </p>
        </div>
        <FontAwesomeIcon className={bannerIcon} icon={faXmark} />
      </div>
    </div>
  );
}

export default AnnouncementBanner;
