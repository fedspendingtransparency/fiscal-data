import React, { FunctionComponent, useState } from 'react';
import { pxToNumber } from '../../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../../variables.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faXTwitter, faLinkedin, faReddit } from '@fortawesome/free-brands-svg-icons';

import {
  shareButtonContent,
  facebookIcon,
  xTwitterIcon,
  linkedInIcon,
  redditIcon,
  emailIcon,
  shareButtonText,
  listShareButtonText,
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

  const displayText = displayStyle === 'list' || (displayStyle === 'responsive' && width >= pxToNumber(breakpointLg));
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
        role={'button'}
        tabIndex={-1}
        aria-label={`${name} content`}
      >
        <FontAwesomeIcon className={shareButtonContentMap[name].className} icon={shareButtonContentMap[name].icon} style={style} />
        {displayText && (
          <span className={displayStyle === 'list' ? listShareButtonText : shareButtonText} style={style}>
            {text}
          </span>
        )}
      </div>
    </>
  );
};

export default ShareButtonContent;
