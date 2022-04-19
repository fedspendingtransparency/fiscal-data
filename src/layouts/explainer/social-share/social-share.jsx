
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faRedditAlien
} from "@fortawesome/free-brands-svg-icons";

import {
  socialShareContent,
  shareButtonContent,
  facebookIcon,
  twitterIcon,
  linkedInIcon,
  redditIcon,
  emailIcon,
  shareButton,
  shareButtonText
} from "./social-share.module.scss";
import { withWindowSize } from "react-fns";
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper";
import { breakpointLg } from "../../../variables.module.scss";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton
} from "react-share";
import {Helmet} from "react-helmet";


const shareButtonContentMap = {
  'facebook': {
    className: facebookIcon,
    text: "Facebook",
    icon: faFacebookF
  },
  'twitter': {
    className: twitterIcon,
    text: "Twitter",
    icon: faTwitter
  },
  'linkedin': {
    className: linkedInIcon,
    text: "LinkedIn",
    icon: faLinkedinIn
  },
  'reddit': {
    className: redditIcon,
    text: "Reddit",
    icon: faRedditAlien
  },
  'email': {
    className: emailIcon,
    text: "Email",
    icon: faEnvelope
  }
}

export const ShareButtonContent = ({ name, width }) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if(width >= pxToNumber(breakpointLg)) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const style = hovered ? {color: "#555555"} : {};
  const text = width >= pxToNumber(breakpointLg) ? shareButtonContentMap[name].text : "";
  return (
    <>
      <div className={ shareButtonContent }
           onMouseEnter={ handleMouseEnter }
           onMouseLeave={ handleMouseLeave }
      >
        <FontAwesomeIcon className={ shareButtonContentMap[name].className }
                         icon={ shareButtonContentMap[name].icon }
                         title={ name }
                         style={ style }
        />
        <div className={ shareButtonText }
             style={ style }
        >
          { text }
        </div>
      </div>
    </>
  )
};

const HelmetMetaData = ({ image }) => {
  return (
    <>
      <Helmet>
        <meta property="image" content={ image } />
        <meta property="og:image" content={ image } />
      </Helmet>
    </>
  )
};

export const SocialShareComponent = ({ quote, title, summary, url, image, width }) => {
   return (
    <div className={ socialShareContent }>
      <h3>{ width >= pxToNumber(breakpointLg) ? "Share this page:" : "" }</h3>
      <HelmetMetaData image={ image } />
      <FacebookShareButton className={ shareButton }
                           url={ url }
                           quote={ quote }
      >
        <ShareButtonContent name={ 'facebook' } width={ width } />
      </FacebookShareButton>
      <TwitterShareButton className={shareButton}
                          url={url}
                          title={title}
      >
        <ShareButtonContent name={ 'twitter' } width={ width } />
      </TwitterShareButton>
      <LinkedinShareButton className={ shareButton }
                           url={ url }
                           title={ title }
                           summary={ summary }
                           source={ "" }
      >
        <ShareButtonContent name={ 'linkedin' } width={ width } />
      </LinkedinShareButton>
      <RedditShareButton className={ shareButton }
                         url={ url }
                         title={ title }
      >
        <ShareButtonContent name={ 'reddit' } width={ width } />
      </RedditShareButton>
      <EmailShareButton className={ shareButton }
                        url={ url }
                        subject={ title }
                        body={ summary }
                        separator={ "\n" }
      >
        <ShareButtonContent name={ 'email' } width={ width } />
      </EmailShareButton>
    </div>
  )
 };

export default withWindowSize(SocialShareComponent);
