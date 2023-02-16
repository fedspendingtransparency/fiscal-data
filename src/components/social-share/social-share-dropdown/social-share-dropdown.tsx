import {
  icon,
  shareButton
} from './social-share-dropdown.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareNodes} from '@fortawesome/free-solid-svg-icons';
import React, {FunctionComponent} from 'react';
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const SocialShareDropdown: FunctionComponent = () => {
  return (
    <>
      <div className={shareButton}>
        <FontAwesomeIcon icon={faShareNodes as IconProp} className={icon} />
        <span>Share</span>
      </div>
    </>
  );
}

export default SocialShareDropdown;
