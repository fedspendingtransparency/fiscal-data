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
import SocialMetaData from './social-metadata/social-metadata';

const baseUrl = globalConstants.BASE_SITE_URL


const analyticsClickHandler = (page, social) => {
  let gaCategory;
  let gaLabel;

  if(page === 'Exchange Rates Converter'){
    gaCategory = page;
    gaLabel = `Share on ${social}`;
  }
  else {
    gaCategory = "Explainers";
    gaLabel = `${page} - Share on ${social}`;
  }
  Analytics.event({
    category: gaCategory,
    action: `Share Click`,
    label: gaLabel,
  })
}

export const SocialShareComponent:FunctionComponent<ISocialShareComponent> = ({
  copy,
  emailSeparator  = '\n',
  pageName,
  width,
  displayStyle,
  clickEvent,
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
    if(clickEvent) {
      clickEvent();
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
            className={`${buttonStyle} facebookShare`}
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
            className={`${buttonStyle} twitterShare`}
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
            className={`${buttonStyle} linkedInShare`}
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
            className={`${buttonStyle} redditShare`}
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
            className={`${buttonStyle} emailShare`}
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
