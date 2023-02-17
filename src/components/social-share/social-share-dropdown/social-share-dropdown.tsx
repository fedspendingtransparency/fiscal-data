import {
  icon,
  shareButton,
  dropdown
} from './social-share-dropdown.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShareNodes} from '@fortawesome/free-solid-svg-icons';
import React, {FunctionComponent, useState} from 'react';
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {SocialShareComponent} from "../social-share";

const SocialShareDropdown: FunctionComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onButtonClick = () => {
    setDropdownOpen(!dropdownOpen);
  }
  const copy = {
    title: 'test',
    description: 'test',
    body: 'test',
    emailSubject: 'test',
    emailBody: 'test',
    url: 'test',
    image: 'test',
  }



  return (
    <>
      <div
        className={shareButton}
        role={'button'}
        tabIndex={0}
        onClick={onButtonClick}
        onKeyPress={onButtonClick}
      >
        <FontAwesomeIcon icon={faShareNodes as IconProp} className={icon} />
        <span>Share</span>
      </div>
      { dropdownOpen && (
        <div
          className={dropdown}
          data-testid={'share-dropdown'}
        >
          <SocialShareComponent
            copy={copy}
            pageName={'test'}
            displayStyle={'list'}
          />
        </div>
      )}
    </>
  );
}

export default SocialShareDropdown;
