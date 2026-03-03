import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faReddit } from '@fortawesome/free-brands-svg-icons/faReddit';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';

import {
  emailIcon,
  facebookIcon,
  linkedInIcon,
  listShareButtonText,
  redditIcon,
  shareButtonContent,
  shareButtonText,
  xTwitterIcon,
  horizontal,
  responsive,
} from './share-button-content.module.scss';
import { IShareButtonContent } from '../../../models/IShareButtonContent';

const shareButtonContentMap = {
  facebook: {
    className: facebookIcon,
    text: 'Facebook',
    icon: faFacebook,
  },
  twitter: {
    className: xTwitterIcon,
    text: 'X (Twitter)',
    icon: faXTwitter,
  },
  linkedin: {
    className: linkedInIcon,
    text: 'LinkedIn',
    icon: faLinkedin,
  },
  reddit: {
    className: redditIcon,
    text: 'Reddit',
    icon: faReddit,
  },
  email: {
    className: emailIcon,
    text: 'Email',
    icon: faEnvelope,
  },
};

const ShareButtonContent: FunctionComponent<IShareButtonContent> = ({ name, displayStyle }) => {
  const [hovered, setHovered] = useState(false);

  const displayClass = displayStyle === 'horizontal' ? horizontal : responsive;

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const style = hovered ? { color: '#555555' } : {};
  const text = shareButtonContentMap[name].text;

  return (
    <>
      <div
        className={`${shareButtonContent} ${displayClass}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="presentation"
        data-testid={`${name} content`}
      >
        <FontAwesomeIcon className={shareButtonContentMap[name].className} icon={shareButtonContentMap[name].icon} style={style} />
        <span className={displayStyle === 'list' ? listShareButtonText : shareButtonText} style={style} data-testid="icon-text">
          {text}
        </span>
      </div>
    </>
  );
};

export default ShareButtonContent;
