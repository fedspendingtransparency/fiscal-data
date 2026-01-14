import React, { FunctionComponent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faLinkedin, faReddit, faXTwitter } from '@fortawesome/free-brands-svg-icons';

import {
  emailIcon,
  facebookIcon,
  hideText,
  linkedInIcon,
  listShareButtonText,
  redditIcon,
  responsiveStyle,
  shareButtonContent,
  shareButtonText,
  xTwitterIcon,
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

const ShareButtonContent: FunctionComponent<IShareButtonContent> = ({ name, width, displayStyle }) => {
  const [hovered, setHovered] = useState(false);

  // const displayText = displayStyle === 'list' || (displayStyle === 'responsive' && width >= pxToNumber(breakpointLg));
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
        className={shareButtonContent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="presentation"
        data-testid={`${name} content`}
      >
        <FontAwesomeIcon className={shareButtonContentMap[name].className} icon={shareButtonContentMap[name].icon} style={style} />
        <span
          className={`${displayStyle === 'responsive' && responsiveStyle} ${displayStyle === 'horizontal' && hideText} ${
            displayStyle === 'list' ? listShareButtonText : shareButtonText
          }`}
          style={style}
        >
          {text}
        </span>
      </div>
    </>
  );
};

export default ShareButtonContent;
