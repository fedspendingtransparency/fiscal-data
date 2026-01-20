import React, { FunctionComponent, useState } from 'react';

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
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import FacebookIcon from '@mui/icons-material/Facebook';

const shareButtonContentMap = {
  facebook: {
    className: facebookIcon,
    text: 'Facebook',
    icon: <FacebookIcon />,
  },
  twitter: {
    className: xTwitterIcon,
    text: 'X (Twitter)',
    icon: <XIcon />,
  },
  linkedin: {
    className: linkedInIcon,
    text: 'LinkedIn',
    icon: <LinkedInIcon />,
  },
  reddit: {
    className: redditIcon,
    text: 'Reddit',
    icon: <XIcon />,
  },
  email: {
    className: emailIcon,
    text: 'Email',
    icon: <XIcon />,
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
        {shareButtonContentMap[name].icon}
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
