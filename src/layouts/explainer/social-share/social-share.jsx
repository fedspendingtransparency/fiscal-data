
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
  shareButtonText,
  shareButtonContainer
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
                         style={ style }
        />
        <span className={ shareButtonText }
             style={ style }
        >
          { text }
        </span>
      </div>
    </>
  )
};

const SocialMetaData = ({ image, title, summary }) => {
  // facebook, linkedIn, and reddit should be all looking for og:image and other og: properties
  // twitter will be looking for twitter: properties
  return (
    <>
      <Helmet>
        <meta property="og:image" content={ image } />
        <meta property="twitter:image" content={ image } />
        <meta property="twitter:summary_large_image" content={ image } />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:description" content={ summary } />
        <meta property="twitter:title" content={ title } />
      </Helmet>
    </>
  )
};

export const SocialShareComponent = ({ title, summary, url, image, quote, width }) => {
   return (
     <>
       <SocialMetaData image={ image }
                       title={ title }
                       summary={ summary }
       />
       <div className={ socialShareContent }>
         <h3>
           { width >= pxToNumber(breakpointLg) ? "Share this page:" : "" }
         </h3>
         <div className={ shareButtonContainer }>
           <FacebookShareButton className={ shareButton }
                                url={ url }
                                quote={ quote }
           >
             <ShareButtonContent name={ 'facebook' } width={ width } />
           </FacebookShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <TwitterShareButton className={shareButton}
                               url={url}
                               title={title}
           >
             <ShareButtonContent name={ 'twitter' } width={ width } />
           </TwitterShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <LinkedinShareButton className={ shareButton }
                                url={ url }
                                title={ title }
                                summary={ summary }
                                source={ "" }
           >
             <ShareButtonContent name={ 'linkedin' } width={ width } />
           </LinkedinShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <RedditShareButton className={ shareButton }
                              url={ url }
                              title={ title }
           >
             <ShareButtonContent name={ 'reddit' } width={ width } />
           </RedditShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <EmailShareButton className={ shareButton }
                             url={ url }
                             subject={ title }
                             body={ summary }
                             separator={ "\n" }
           >
             <ShareButtonContent name={ 'email' } width={ width } />
           </EmailShareButton>
         </div>
       </div>
     </>
  )
 };

export default withWindowSize(SocialShareComponent);
