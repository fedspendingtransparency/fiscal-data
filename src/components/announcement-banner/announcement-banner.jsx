import React, { useState } from 'react';
import {
  container,
  content,
  infoIcon,
  closeButton,
  closeIcon
} from "./announcement-banner.module.scss";
import {faInfoCircle, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const AnnouncementBanner = ({
  altStyle,
  closable,
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
          { closable && 
            <button onClick={hideBanner} onKeyPress={hideBanner} className={closeButton} aria-label={'Close banner'}>
              <FontAwesomeIcon icon={faXmark} className={closeIcon} />
            </button>
          }
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
