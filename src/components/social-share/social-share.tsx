import React from "react"
import {
  socialShareContent,
  shareButton,
  shareButtonContainer,
  horizontalShareButton,
  horizontalShareButtonContainer,
  horizontalSocialShareContent,
  listShareButton,
  listSocialShareContent,
} from "./social-share.module.scss"
import { withWindowSize } from "react-fns"
import {pxToNumber} from "../../helpers/styles-helper/styles-helper";
import { breakpointLg } from "../../variables.module.scss"
import { Helmet } from "react-helmet"
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
} from "react-share"
import globalConstants from "../../helpers/constants"
import Analytics from "../../utils/analytics/analytics"
import ShareButtonContent from "./share-button-content/share-button-content";
import {FunctionComponent} from "react";
import {ISocialShareComponent} from '../../models/ISocialShareComponent';

const baseUrl = globalConstants.BASE_SITE_URL

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
const analyticsClickHandler = (page, social) => {
  Analytics.event({
    category: "Explainers",
    action: `Share Click`,
    label: `${page} - Share on ${social}`,
  })
}

export const SocialShareComponent:FunctionComponent<ISocialShareComponent> = ({
  copy,
  emailSeparator  = '\n',
  pageName,
  width,
  buttonClick,
  displayStyle,
  customHandleButtonClick,
}) => {


  const {
    title,
    description,
    body,
    emailSubject,
    emailBody,
    url,
    image,
  } = copy;

  let contentStyle = socialShareContent;
  let containerStyle = shareButtonContainer;
  let buttonStyle = shareButton;

  if (displayStyle === 'horizontal') {
    contentStyle = horizontalSocialShareContent;
    containerStyle = horizontalShareButtonContainer;
    buttonStyle = horizontalShareButton;
  } else if (displayStyle === 'list') {
    contentStyle = listSocialShareContent;
    containerStyle = null;
    buttonStyle = listShareButton;
  }

  const handleClick = (socialName) => {
    analyticsClickHandler(pageName, socialName);
    if(customHandleButtonClick) {
      customHandleButtonClick();
    }
  }

  return (
    <>
      <SocialMetaData
        image={image}
        title={title}
        description={description}
        url={url}
      />
      <div
        className={`${contentStyle} socialShareContent`}
      >
        {(displayStyle === 'responsive' && width >= pxToNumber(breakpointLg)) && (
          <h3>Share this page:</h3>
        )}
        <div
          className={containerStyle}
        >
          <FacebookShareButton
            className={buttonStyle}
            url={url}
            quote={body}
            beforeOnClick={() => handleClick('Facebook')}
          >
            <ShareButtonContent
              name={"facebook"}
              width={width}
              displayStyle={displayStyle}
            />
          </FacebookShareButton>
        </div>
        <div
          className={containerStyle}
        >
          <TwitterShareButton
            className={buttonStyle}
            url={url}
            title={body}
            beforeOnClick={() => handleClick('Twitter')}
          >
            <ShareButtonContent
              name={"twitter"}
              width={width}
              displayStyle={displayStyle}
            />
          </TwitterShareButton>
        </div>
        <div
          className={containerStyle}
        >
          <LinkedinShareButton
            className={buttonStyle}
            url={url}
            title={title}
            summary={body}
            source={baseUrl}
            windowHeight={650}
            beforeOnClick={() => handleClick('LinkedIn')}
          >
            <ShareButtonContent
              name={"linkedin"}
              width={width}
              displayStyle={displayStyle}
            />
          </LinkedinShareButton>
        </div>
        <div
          className={containerStyle}
        >
          <RedditShareButton
            className={buttonStyle}
            url={url}
            title={title}
            beforeOnClick={() => handleClick('Reddit')}
          >
            <ShareButtonContent
              name={"reddit"}
              width={width}
              displayStyle={displayStyle}
            />
          </RedditShareButton>
        </div>
        <div className={containerStyle}>
          <EmailShareButton
            className={buttonStyle}
            url={url}
            subject={emailSubject}
            body={emailBody}
            separator={emailSeparator}
            beforeOnClick={() => handleClick('Email')}
          >
            <ShareButtonContent
              name={"email"}
              width={width}
              displayStyle={displayStyle}
            />
          </EmailShareButton>
        </div>
      </div>
    </>
  )
}

export default withWindowSize(SocialShareComponent)
