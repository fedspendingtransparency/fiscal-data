import React from 'react';
import {
  afgBookIcon,
  comingSoon,
  explainerImage,
  explainerImageContainer,
  iconTitle,
  mainContent,
  mainTitle,
  secondaryTitle,
  showOnDesktop,
  showOnMobile,
  tileLayoutWrapper,
  imageSection,
  textSection,
  twoColLayout,
  rightTileText,
} from './homepage-tile.module.scss';
import { Link } from 'gatsby-link';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import Analytics from '../../../utils/analytics/analytics';
import { ga4DataLayerPush } from '../../../helpers/google-analytics/google-analytics-helper';

let homepageTile;
const HomePageTile = ({ content, images, layout, explainerTile, rightTile }) => {
  let desktopImage, mobileImage;

  if (images) {
    desktopImage = images.allFile.topicsImages.find(image => image.name === content.desktopImage);
    mobileImage = images.allFile.topicsImages.find(image => image.name === content.mobileImage);
  }

  const afgIcon = '/images/AFG-icon.svg';

  const desktop = (
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
      className={explainerTile ? explainerImage : null}
    />
  );

  const mobile = <GatsbyImage image={getImage(mobileImage)} alt={content.altText} loading="eager" role="presentation" />;

  const responsiveImage = (
    <>
      <div className={showOnDesktop}>{desktop}</div>
      <div className={showOnMobile}>{mobile}</div>
    </>
  );

  const card = (
    <div className={`${mainContent} ${layout === 'two-col' ? twoColLayout : ''}`} data-testid="tile">
      <div className={tileLayoutWrapper}>
        <div className={`${imageSection} ${explainerTile ? explainerImageContainer : ''}`}>{responsiveImage}</div>
        <div className={`${textSection} ${content.path ? '' : comingSoon}`}>
          <div className={content.mainFeature ? iconTitle : ''}>
            {content.mainFeature && <img src={afgIcon} alt="Icon" className={afgBookIcon} />}
            <h5 className={`${content.mainFeature ? mainTitle : secondaryTitle} ${rightTile ? rightTileText : ''}`}>{content.title}</h5>
          </div>
          <div>{content.bodyGenerator ? content.bodyGenerator() : content.body}</div>
        </div>
      </div>
    </div>
  );

  const analyticsHandler = (event, label) => {
    Analytics.event({
      category: 'Homepage Navigation',
      action: 'Citation Click',
      label: label,
    });
    ga4DataLayerPush({
      event: event,
      eventLabel: label,
    });
  };

  const handleMouseEnter = label => {
    homepageTile = setTimeout(() => {
      Analytics.event({
        category: 'Homepage Cards',
        action: 'Card Hover',
        label: label,
      });
    }, 3000);
  };
  const handleMouseLeave = () => {
    clearTimeout(homepageTile);
  };
  return (
    <>
      {content.path ? (
        <Link
          to={content.path}
          data-testid="tile-link"
          onClick={() => analyticsHandler('Citation Click', content.analyticsName)}
          onMouseEnter={() => handleMouseEnter(content.analyticsName)}
          onMouseLeave={handleMouseLeave}
        >
          {card}
        </Link>
      ) : (
        <div>{card}</div>
      )}
    </>
  );
};

export default HomePageTile;
