
import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {faFacebookF, faTwitter, faLinkedinIn, faRedditAlien} from "@fortawesome/free-brands-svg-icons";

import {
  socialShareContent,
  shareButtonContent,
  facebookIcon,
  twitterIcon,
  linkedInIcon,
  redditIcon,
  emailIcon,
  shareButton
} from "./social-share.module.scss";
import {withWindowSize} from "react-fns";
import {pxToNumber} from "../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../variables.module.scss";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton
} from "react-share";
import {Helmet} from "react-helmet";

import sampleImg from '../../../../static/topic-icons/debt.png';


const smallSampleCopy = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua.
`

const shareButtonContentList = [
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

export const ShareButtonContent = withWindowSize(({id}) => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    if(window.innerWidth >= pxToNumber(breakpointLg)) {
      setHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const style = hovered ? {color: "#555555"} : {};
  const text = window.innerWidth < pxToNumber(breakpointLg) ? "" : shareButtonContentList[id].text;
  return (
    <>
      <div className={shareButtonContent}
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           data-testid={shareButtonContentList[id].className}
      >
        <FontAwesomeIcon className={shareButtonContentList[id].className}
                         icon={shareButtonContentList[id].icon}
                         style={style}/>
        <p style={style} >
          {text}
        </p>
      </div>
    </>
  )
});

const HelmetMetaData = ({image}) => {
  return (
    <>
      <Helmet>
        <meta property="image" content={image}/>
        <meta property="og:image" content={image}/>
      </Helmet>
    </>
  )
};

const SocialShare = withWindowSize(({quote, title, summary, url}) => {
  return (
    <div className={socialShareContent}>
      <h3 hidden={window.innerWidth < pxToNumber(breakpointLg)}>Share this page:</h3>
      <HelmetMetaData image={sampleImg} />
      <FacebookShareButton className={shareButton}
                           url={url}
                           quote={smallSampleCopy}>
        <ShareButtonContent id={0}/>
      </FacebookShareButton>
      <TwitterShareButton className={shareButton}
                          url={url}
                          title={title}>
        <ShareButtonContent id={1}/>
      </TwitterShareButton>
      <LinkedinShareButton className={shareButton}
                           url={url}
                           title={title}
                           summary={summary}
                           source={""}>
        <ShareButtonContent id={2}/>
      </LinkedinShareButton>
      <RedditShareButton className={shareButton}
                         url={url}
                         title={title}>
        <ShareButtonContent id={3}/>
      </RedditShareButton>
      <EmailShareButton className={shareButton}
                        url={url}
                        subject={title}
                        body={summary}
                        separator={"\n"}>
        <ShareButtonContent id={4}/>
      </EmailShareButton>
    </div>
  )
});

export default SocialShare;
