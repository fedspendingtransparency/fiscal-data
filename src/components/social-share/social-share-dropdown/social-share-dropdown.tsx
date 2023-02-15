import {
  icon,
  shareButton
} from './social-share-dropdown.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareNodes} from '@fortawesome/free-solid-svg-icons';
import React, {FunctionComponent} from 'react';

const SocialShareDropdown: FunctionComponent = () => {
  return (
    <>
      <div className={shareButton}>
        <FontAwesomeIcon icon={faShareNodes} className={icon} />
        <span>Share</span>
      </div>
    </>
  );
}

export default SocialShareDropdown;
