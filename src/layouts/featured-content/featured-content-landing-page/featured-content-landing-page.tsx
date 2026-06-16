import React from 'react';
import { featuredContentLanding } from './featured-content-landing-page-config';
import HomepageTile from '../../../components/topics-section/homepage-tile/homepage-tile';


const FeaturedContentLandingPage = ({ images }) => {
  return (
    <div>
      <div></div>
      <div>
        {featuredContentLanding.map(section => (
          <section key={section.categories}>
            <div>{section.categories}</div>
            <div>
              {section.articles.map(article => (
                <HomepageTile
                  content={{
                    title: article.title,
                    body: article.body,
                    altText: article.altText,
                    path: article.path,
                  }}
                  images={images}
                  rightTile
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FeaturedContentLandingPage;
