import React, { FunctionComponent, SyntheticEvent } from 'react';
import {
  customShareButton,
  headerText,
  horizontalShareButton,
  horizontalShareButtonContainer,
  horizontalSocialShareContent,
  listShareButton,
  listSocialShareContent,
  shareButton,
  shareButtonContainer,
  socialShareContent,
} from './social-share.module.scss';
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';
import Analytics from '../../utils/analytics/analytics';
import ShareButtonContent from './share-button-content/share-button-content';
import { ISocialShareComponent } from '../../models/ISocialShareComponent';
import Heading from '../heading/heading';
import { redirectModalState } from '../../components/modal/redirect-modal/redirect-modal-helper';
import { useSetRecoilState } from 'recoil';
import { getFacebookParams, getLinkedInParams, getRedditParams, getTwitterParams } from './social-share-helper';
import { EmailShareButton } from 'react-share';

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
  const { title, emailSubject, emailBody, url } = copy;
  const setModal = useSetRecoilState(redirectModalState);

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
      <ul className={`${contentStyle} socialShareContent`}>
        {displayStyle === 'responsive' && width >= pxToNumber(breakpointLg) && (
          <Heading headingLevel={headerLevel} className={headerText}>
            Share this page
          </Heading>
        )}
        <li className={containerStyle}>
          <button
            className={`${buttonStyle} ${customShareButton} facebookShare`}
            aria-label="facebook"
            onClick={e => {
              handleClick('Facebook');
              openModal(e, getFacebookParams('facebook', url));
            }}
          >
            <ShareButtonContent name="facebook" width={width} displayStyle={displayStyle} />
          </button>
        </li>
        <li className={containerStyle}>
          <button
            className={`${buttonStyle} ${customShareButton} twitterShare`}
            aria-label="twitter"
            onClick={e => {
              handleClick('Twitter');
              openModal(e, getTwitterParams('twitter', url, title));
            }}
          >
            <ShareButtonContent name="twitter" width={width} displayStyle={displayStyle} />
          </button>
        </li>
        <li className={containerStyle}>
          <button
            className={`${buttonStyle} ${customShareButton} linkedInShare`}
            aria-label="linkedin"
            onClick={e => {
              handleClick('LinkedIn');
              openModal(e, getLinkedInParams('linkedin', url, title));
            }}
          >
            <ShareButtonContent name="linkedin" width={width} displayStyle={displayStyle} />
          </button>
        </li>
        <li className={containerStyle}>
          <button
            className={`${buttonStyle} ${customShareButton} redditShare`}
            aria-label="reddit"
            onClick={e => {
              handleClick('Reddit');
              openModal(e, getRedditParams('reddit', url, title));
            }}
          >
            <ShareButtonContent name="reddit" width={width} displayStyle={displayStyle} />
          </button>
        </li>
        <li className={containerStyle}>
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
        </li>
      </ul>
    </>
  );
};

export default withWindowSize(SocialShareComponent);
