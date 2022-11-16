import React, { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faRedditAlien,
} from "@fortawesome/free-brands-svg-icons"

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
  shareButtonContainer,
  horizontalShareButton,
  horizontalShareButtonContainer,
  horizontalSocialShareContent,
} from "./social-share.module.scss"
import { withWindowSize } from "react-fns"
import { pxToNumber } from "../../../helpers/styles-helper/styles-helper"
import { breakpointLg } from "../../../variables.module.scss"
import { Helmet } from "react-helmet"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
} from "react-share"
import globalConstants from "../../../helpers/constants"
import Analytics from "../../../utils/analytics/analytics"
import {content} from "../../../components/accordion/accordion.module.scss";

const baseUrl = globalConstants.BASE_SITE_URL

const shareButtonContentMap = {
  facebook: {
    className: facebookIcon,
    text: "Facebook",
    icon: faFacebookF,
  },
  twitter: {
    className: twitterIcon,
    text: "Twitter",
    icon: faTwitter,
  },
  linkedin: {
    className: linkedInIcon,
    text: "LinkedIn",
    icon: faLinkedinIn,
  },
  reddit: {
    className: redditIcon,
    text: "Reddit",
    icon: faRedditAlien,
  },
  email: {
    className: emailIcon,
    text: "Email",
    icon: faEnvelope,
  },
}

const analyticsClickHandler = (page, social) => {
  Analytics.event({
    category: "Explainers",
    action: `Share Click`,
    label: `${page} - Share on ${social}`,
  })
}

export const ShareButtonContent = ({ name, width, horizontal }) => {
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    if (width >= pxToNumber(breakpointLg)) {
      setHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  const style = hovered ? { color: "#555555" } : {}
  const text =
    width >= pxToNumber(breakpointLg) ? shareButtonContentMap[name].text : ""
  return (
    <>
      <div
        className={shareButtonContent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FontAwesomeIcon
          className={shareButtonContentMap[name].className}
          icon={shareButtonContentMap[name].icon}
          style={style}
        />
        {!horizontal && (
          <span className={shareButtonText} style={style}>
            {text}
          </span>
        )}
      </div>
    </>
  )
}

const SocialMetaData = ({ image, title, description, url }) => {
  return (
    <>
      <Helmet>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    </>
  )
}

export const SocialShareComponent = ({
  title,
  description,
  body,
  emailSubject,
  emailBody,
  url,
  image,
  pageName,
  width,
  horizontal,
}) => {

  const orientation = true;

  return (
    <>
      <SocialMetaData
        image={image}
        title={title}
        description={description}
        url={url}
      />
      <div
        className=
          {horizontal ? horizontalSocialShareContent : `${socialShareContent} socialShareContent`}
      >
        {(!horizontal && width >= pxToNumber(breakpointLg)) && (
          <h3>Share this page:</h3>
        )}
        <div
          className={horizontal ? horizontalShareButtonContainer : shareButtonContainer}
        >
          <FacebookShareButton
            className={horizontal ? horizontalShareButton : shareButton}
            url={url}
            quote={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Facebook")}
          >
            <ShareButtonContent
              horizontal={horizontal}
              name={"facebook"}
              width={width}
            />
          </FacebookShareButton>
        </div>
        <div
          className={horizontal ? horizontalShareButtonContainer : shareButtonContainer}
        >
          <TwitterShareButton
            className={horizontal ? horizontalShareButton : shareButton}
            url={url}
            title={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Twitter")}
          >
            <ShareButtonContent
              horizontal={horizontal}
              name={"twitter"}
              width={width}
            />
          </TwitterShareButton>
        </div>
        <div
          className={horizontal ? horizontalShareButtonContainer : shareButtonContainer}
        >
          <LinkedinShareButton
            className={horizontal ? horizontalShareButton : shareButton}
            url={url}
            title={title}
            summary={body}
            source={baseUrl}
            beforeOnClick={() => analyticsClickHandler(pageName, "LinkedIn")}
          >
            <ShareButtonContent
              horizontal={horizontal}
              name={"linkedin"}
              width={width}
            />
          </LinkedinShareButton>
        </div>
        <div
          className={horizontal ? horizontalShareButtonContainer : shareButtonContainer}
        >
          <RedditShareButton
            className={horizontal ? horizontalShareButton : shareButton}
            url={url}
            title={title}
            beforeOnClick={() => analyticsClickHandler(pageName, "Reddit")}
          >
            <ShareButtonContent
              horizontal={horizontal}
              name={"reddit"}
              width={width}
            />
          </RedditShareButton>
        </div>
        <div className={horizontal ? horizontalShareButtonContainer : shareButtonContainer}>
          <EmailShareButton
            className={horizontal ? horizontalShareButton : shareButton}
            url={url}
            subject={emailSubject}
            body={emailBody}
            separator={"\n"}
            beforeOnClick={() => analyticsClickHandler(pageName, "Email")}
          >
            <ShareButtonContent
              horizontal={horizontal}
              name={"email"}
              width={width}
            />
          </EmailShareButton>
        </div>
      </div>
    </>
  )
}

export default withWindowSize(SocialShareComponent)
