
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

// import sampleImg from '../../../../../static/topic-icons/debt.png'


const sampleCopy = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
  labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
  esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
  in culpa qui officia deserunt mollit anim id est laborum.
`

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
    setHovered(true);
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

// const HelmetMetaData = () => {
//   return (
//     <>
//       <Helmet>
//         <title>Sample Title</title>
//         <meta property="image" content={sampleImg}/>
//       </Helmet>
//     </>
//   )
// };

const SocialShare = withWindowSize(() => {
  const url = "localhost:8000/national-debt";
  return (
    <div className={socialShareContent}>
      <h3 hidden={window.innerWidth < pxToNumber(breakpointLg)}>Share this page:</h3>
      {/*<HelmetMetaData />*/}
      <FacebookShareButton className={shareButton}
                           url={url}
                           quote={"Sample quote"}>
        <ShareButtonContent id={0}/>
      </FacebookShareButton>
      <TwitterShareButton className={shareButton}
                          url={url}
                          title={"Sample Title"}>
        <ShareButtonContent id={1}/>
      </TwitterShareButton>
      <LinkedinShareButton className={shareButton}
                           url={url}
                           title={"Sample Title"}
                           summary={"Sample Summary"}
                           source={""}>
        <ShareButtonContent id={2}/>
      </LinkedinShareButton>
      <RedditShareButton className={shareButton}
                         url={url}
                         title={"Sample Title"}>
        <ShareButtonContent id={3}/>
      </RedditShareButton>
      <EmailShareButton className={shareButton}
                        url={url}
                        subject={"Sample Subject"}
                        body={"Sample Body"} >
        <ShareButtonContent id={4}/>
      </EmailShareButton>
    </div>
  )
});

export default SocialShare;
