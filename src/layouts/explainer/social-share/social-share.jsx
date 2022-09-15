import React, { useState } from "react"
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

export const ShareButtonContent = ({ name, width, orientation }) => {
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
        <span className={shareButtonText} style={style}>
          {!orientation && text}
        </span>
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
  orientation,
}) => {
  const orientationStyles = {
    horizontal: {
      socialShareContent: {
        // paddingBottom: "1.875rem",
        // height: "1.125rem",
        // marginTop: "1rem",
        // marginBottom: "1rem",
        // paddingTop: "16px",
        // paddingBottom: "16px",
        width: "360px",
        // icon should be 16px, with padding 16px top and bottom
        // 39px padding left and right in container
        height: "48px",
      },

      shareButton: {
        display: "flex",
        textAlign: "justify",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        justifyContent: "center",
        height: "1rem",
      },
      shareButtonContainer: {
        display: "inline-flex",
        textAlign: "justify",
        justifyContent: "center",
        width: "20%",
      },
    },
  }

  const orientationStyle = orientationStyles[orientation] || {}
  console.log(orientationStyle, "orientationStyle")
  return (
    <>
      <SocialMetaData
        image={image}
        title={title}
        description={description}
        url={url}
      />
      <div
        className={socialShareContent}
        style={{
          ...orientationStyle.socialShareContent,
        }}
      >
        {!orientation && (
          <h3>{width >= pxToNumber(breakpointLg) ? "Share this page:" : ""}</h3>
        )}

        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <FacebookShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            quote={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Facebook")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"facebook"}
              width={width}
            />
          </FacebookShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <TwitterShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={body}
            beforeOnClick={() => analyticsClickHandler(pageName, "Twitter")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"twitter"}
              width={width}
            />
          </TwitterShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <LinkedinShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={title}
            summary={body}
            source={baseUrl}
            beforeOnClick={() => analyticsClickHandler(pageName, "LinkedIn")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"linkedin"}
              width={width}
            />
          </LinkedinShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <RedditShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            title={title}
            beforeOnClick={() => analyticsClickHandler(pageName, "Reddit")}
          >
            <ShareButtonContent
              orientation={orientation}
              name={"reddit"}
              width={width}
            />
          </RedditShareButton>
        </div>
        <div
          className={shareButtonContainer}
          style={{
            ...orientationStyle.shareButtonContainer,
          }}
        >
          <EmailShareButton
            className={shareButton}
            style={{
              ...orientationStyle.shareButton,
            }}
            url={url}
            subject={emailSubject}
            body={emailBody}
            separator={"\n"}
            beforeOnClick={() => analyticsClickHandler(pageName, "Email")}
          >
            <ShareButtonContent
              orientation={orientation}
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
