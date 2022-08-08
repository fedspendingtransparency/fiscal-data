
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
import { Helmet } from "react-helmet";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton
} from "react-share";
import globalConstants from "../../../helpers/constants";
import Analytics from "../../../utils/analytics/analytics";

const baseUrl = globalConstants.BASE_SITE_URL;

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

const analyticsClickHandler = (page, social) => {
  Analytics.event({
    category: 'Explainers',
    action: `Share Click`,
    label: `${page} - Share on ${social}`
  });
  console.log({
    category: 'Explainers',
    action: `Share Click`,
    label: `${page} - Share on ${social}`
  });
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

const SocialMetaData = ({ image, title, description, url }) => {
  return (
    <>
      <Helmet>
        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ description } />
        <meta property="og:image" content={ image } />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ url } />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ title } />
        <meta name="twitter:description" content={ description } />
        <meta name="twitter:image" content={ image } />
      </Helmet>
    </>
  )
};

export const SocialShareComponent = (
  {
    title,
    description,
    body,
    emailSubject,
    emailBody,
    url,
    image,
    pageName,
    width
  }) => {

   return (
     <>
       <SocialMetaData image={ image }
                       title={ title }
                       description={ description }
                       url={ url }
       />
       <div className={ socialShareContent }>
         <h3>
           { width >= pxToNumber(breakpointLg) ? "Share this page:" : "" }
         </h3>
         <div className={ shareButtonContainer }>
           <FacebookShareButton className={ shareButton }
                                url={ url }
                                quote={ body }
                                onClick={() => analyticsClickHandler(pageName, 'Facebook')}
           >
             <ShareButtonContent name={ 'facebook' } width={ width } />
           </FacebookShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <TwitterShareButton className={ shareButton }
                               url={ url }
                               title={ body }
                               onClick={() => analyticsClickHandler(pageName, 'Twitter')}
           >
             <ShareButtonContent name={ 'twitter' } width={ width } />
           </TwitterShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <LinkedinShareButton className={ shareButton }
                                url={ url }
                                title={ title }
                                summary={ body }
                                source={ baseUrl }
                                onClick={() => analyticsClickHandler(pageName, 'LinkedIn')}
           >
             <ShareButtonContent name={ 'linkedin' } width={ width } />
           </LinkedinShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <RedditShareButton className={ shareButton }
                              url={ url }
                              title={ title }
                              onClick={() => analyticsClickHandler(pageName, 'Reddit')}
           >
             <ShareButtonContent name={ 'reddit' } width={ width } />
           </RedditShareButton>
         </div>
         <div className={ shareButtonContainer }>
           <EmailShareButton className={ shareButton }
                             url={ url }
                             subject={ emailSubject }
                             body={ emailBody }
                             separator={ "\n" }
                             onClick={() => analyticsClickHandler(pageName, 'Email')}
           >
             <ShareButtonContent name={ 'email' } width={ width } />
           </EmailShareButton>
         </div>
       </div>
     </>
  )
 };

export default withWindowSize(SocialShareComponent);
