
import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faTwitter, faLinkedinIn, faRedditAlien} from "@fortawesome/free-brands-svg-icons";

import {
  socialShareContent,
  platform,
  facebookIcon,
  twitterIcon,
  linkedInIcon,
  redditIcon,
  emailIcon
} from "./social-share.module.scss";

const platforms = [
  {
    className: facebookIcon,
    text: "Facebook",
    icon: faFacebookF
  },
  {
    className: twitterIcon,
    text: "Twitter",
    icon: faTwitter
  },
  {
    className: linkedInIcon,
    text: "LinkedIn",
    icon: faLinkedinIn
  },
  {
    className: redditIcon,
    text: "Reddit",
    icon: faRedditAlien
  },
  {
    className: emailIcon,
    text: "Email",
    icon: faEnvelope
  },

]

const Platform = ({id}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const style = hovered ? {color: "#555555"} : {};

  return (
    <>
      <div className={platform}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
      >
        <FontAwesomeIcon className={platforms[id].className}
                         icon={platforms[id].icon}
                         style={style}/>
        <p style={style}>
          {platforms[id].text}
        </p>
      </div>
    </>
  )
};

const SocialShare = () => {


  return (
    <div className={socialShareContent}>
      <h3>Share this page:</h3>
      <Platform id={0}/>
      <Platform id={1}/>
      <Platform id={2}/>
      <Platform id={3}/>
      <Platform id={4}/>
    </div>
  )
};

export default SocialShare;
