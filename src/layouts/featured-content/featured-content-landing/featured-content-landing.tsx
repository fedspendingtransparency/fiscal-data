import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import HomePageTile from '../../../components/topics-section/homepage-tile/homepage-tile';
import { banner, categoryHeader, content, sectionBar, tileGrid } from './featured-content-landing.module.scss';
import { featuredContentBanner, featuredContentLanding } from './featured-content-landing-config';

const FeaturedContentLanding = () => {
  const images = useStaticQuery(
    graphql`
      query {
        allFile(filter: { extension: { eq: "png" } }) {
          topicsImages: nodes {
            name
            childImageSharp {
              gatsbyImageData(quality: 100, placeholder: BLURRED)
            }
          }
        }
      }
    `
  );

  const bannerImage = images.allFile.topicsImages.find(image => image.name === featuredContentBanner.image);

  return (
    <div data-testid="featured-content-landing">
      <div className={banner} data-testid="featured-content-banner">
        <GatsbyImage image={getImage(bannerImage)} alt={featuredContentBanner.altText} loading="eager" />
      </div>
      <div className={content}>
        {featuredContentLanding.map(section => (
          <section key={section.category}>
            <h2 className={categoryHeader}>{section.category}</h2>
            <div className={tileGrid}>
              {section.articles.map(article => (
                <HomePageTile
                  key={article.path}
                  content={{
                    title: article.title,
                    body: article.body,
                    altText: article.altText,
                    desktopImage: article.image,
                    mobileImage: article.image,
                    path: article.path,
                    analyticsName: article.analyticsName,
                  }}
                  images={images}
                  rightTile
                  analyticsCategory="Featured Content Navigation"
                  hoverAnalyticsCategory="Featured Content Cards"
                />
              ))}
            </div>
            <div className={sectionBar} />
          </section>
        ))}
      </div>
    </div>
  );
};

export default FeaturedContentLanding;
