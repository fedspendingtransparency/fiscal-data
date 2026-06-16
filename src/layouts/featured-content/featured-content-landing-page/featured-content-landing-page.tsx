import React from 'react';
import { featuredContentLanding } from './featured-content-landing-page-config';
import HomepageTile from '../../../components/topics-section/homepage-tile/homepage-tile';


const FeaturedContentLandingPage = ({}) => {
  return(
  <div>
    <div className={topBanner}></div>
    <div className={featureLandingPageContent}>
      {featuredContentLanding.map(section => (
        <section key={section.categories}>
          <div className={categoryHeader}>{sections.category}</div>
          <div>
            {section.articles.map(article => (
              <HomepageTile content={{ title: article.title, body: article.body, altText: article.altText, path: article.path }}></HomepageTile>
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
  );
};

export default FeaturedContentLandingPage;
