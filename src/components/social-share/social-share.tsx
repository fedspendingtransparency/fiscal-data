import React, { SyntheticEvent, useState } from 'react';
import {
  socialShareContent,
  shareButton,
  shareButtonContainer,
  horizontalShareButton,
  horizontalShareButtonContainer,
  horizontalSocialShareContent,
  listShareButton,
  listSocialShareContent,
  headerText,
} from './social-share.module.scss';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, RedditShareButton, EmailShareButton } from 'react-share';
import globalConstants from '../../helpers/constants';
import Analytics from '../../utils/analytics/analytics';
import ShareButtonContent from './share-button-content/share-button-content';
import { FunctionComponent } from 'react';
import { ISocialShareComponent } from '../../models/ISocialShareComponent';
import SocialMetaData from './social-metadata/social-metadata';
import Heading from '../heading/heading';
import { redirectModalState } from '../../components/modal/redirect-modal/redirect-modal-helper';
import { useSetRecoilState } from 'recoil';
import RedirectModal from '../modal/redirect-modal/redirect-modal';
import { getSocialParams } from './social-share-helper';

const baseUrl = globalConstants.BASE_SITE_URL;

const analyticsClickHandler = (page: string, social: string, explainer: boolean) => {
  let gaCategory: string;
  let gaLabel: string;

  if (!explainer) {
    gaCategory = page;
    gaLabel = `Share on ${social}`;
  } else {
    gaCategory = 'Explainers';
    gaLabel = `${page} - Share on ${social}`;
  }
  Analytics.event({
    category: gaCategory,
    action: `Share Click`,
    label: gaLabel,
  });
};

export const SocialShareComponent: FunctionComponent<ISocialShareComponent> = ({
  copy,
  emailSeparator = '\n',
  pageName,
  width,
  displayStyle,
  clickEvent,
  headerLevel = 'h3',
  explainer,
}) => {
  const { title, description, body, emailSubject, emailBody, url, image } = copy;
  const setModal = useSetRecoilState(redirectModalState);
  // const [shareUrl, setShareUrl] = useState("");

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

  const handleClick = (socialName: string) => {
    analyticsClickHandler(pageName, socialName, explainer);
    if (clickEvent) {
      clickEvent();
    }
  };

  const openModal = (e: SyntheticEvent, url: string) => {
    e.preventDefault();
    // onClick?.();
    setModal({
      open: true,
      url,
      after: () => {
        window.open(url, '_blank', 'noreferrer, noopener, width=650,height=600');
      },
    });
  };

  return (
    <>
      <SocialMetaData image={image} title={title} description={description} url={url} />
      <div className={`${contentStyle} socialShareContent`}>
        {displayStyle === 'responsive' && width >= pxToNumber(breakpointLg) && (
          <Heading headingLevel={headerLevel} className={headerText}>
            Share this page
          </Heading>
        )}
        <div className={containerStyle}>
          <FacebookShareButton className={`${buttonStyle} facebookShare`} url={url} quote={body} beforeOnClick={() => handleClick('Facebook')}>
            {/*{getSocialParams('facebook', url)}*/}
            <ShareButtonContent name="facebook" width={width} displayStyle={displayStyle} />
          </FacebookShareButton>
        </div>
        {/*<div className="div">*/}
        {/*  <button onClick={e => openModal(e, 'https://www.linkedin.com/shareArticle')}>*/}
        {/*    <ShareButtonContent name="linkedin" width={width} displayStyle={displayStyle} />*/}
        {/*  </button>*/}
        {/*</div>*/}
        <div className={containerStyle}>
          <TwitterShareButton className={`${buttonStyle} twitterShare`} url={url} title={body} beforeOnClick={() => handleClick('Twitter')}>
            <ShareButtonContent name="twitter" width={width} displayStyle={displayStyle} />
          </TwitterShareButton>
        </div>
      </div>
      <div className={containerStyle}>
        <a href={getSocialParams('linkedin', url, title, body, baseUrl)} target="_blank" rel="noopener noreferrer">
          test
        </a>
        <LinkedinShareButton
          className={`${buttonStyle} linkedInShare`}
          url={url}
          title={title}
          summary={body}
          source={baseUrl}
          windowHeight={650}
          beforeOnClick={() => handleClick('LinkedIn')}
        >
          <ShareButtonContent name="linkedin" width={width} displayStyle={displayStyle} />
        </LinkedinShareButton>
      </div>
      <div className={containerStyle}>
        <RedditShareButton className={`${buttonStyle} redditShare`} url={url} title={title} beforeOnClick={() => handleClick('Reddit')}>
          <ShareButtonContent name="reddit" width={width} displayStyle={displayStyle} />
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
          <ShareButtonContent name="email" width={width} displayStyle={displayStyle} />
        </EmailShareButton>
      </div>
    </>
  );
};

export default withWindowSize(SocialShareComponent);
