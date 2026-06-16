import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
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

  return (
    <div data-testid="featured-content-landing">
      <div className={banner}>
        <img src={featuredContentBanner.image} alt={featuredContentBanner.altText} data-testid="featured-content-banner" />
      </div>
      <div className={content}>
        {featuredContentLanding.map(section => (
          <section key={section.category}>
            <div className={sectionBar} />
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
          </section>
        ))}
      </div>
    </div>
  );
};

export default FeaturedContentLanding;
