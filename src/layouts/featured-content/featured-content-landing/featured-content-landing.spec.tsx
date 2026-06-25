import React from 'react';
import { render } from '@testing-library/react';
import { useStaticQuery } from 'gatsby';
import FeaturedContentLanding from './featured-content-landing';
import { featuredContentBanner, featuredContentLanding } from './featured-content-landing-config';

const mockImages = {
  allFile: {
    topicsImages: [
      {
        name: 'story-of-data-transparency',
        childImageSharp: {
          gatsbyImageData: {},
        },
      },
    ],
  },
};

beforeEach(() => {
  (useStaticQuery as jest.Mock).mockReturnValue(mockImages);
});

describe('Featured Content Landing', () => {

  it('renders a header for each configured category', () => {
    const { getByText } = render(<FeaturedContentLanding />);

    featuredContentLanding.forEach(section => {
      expect(getByText(section.category)).toBeInTheDocument();
    });
  });

  it('renders a tile per configured article, linking to its article page', () => {
    const { getByText, getByRole } = render(<FeaturedContentLanding />);

    featuredContentLanding.forEach(section => {
      section.articles.forEach(article => {
        expect(getByText(article.title)).toBeInTheDocument();
        expect(getByText(article.body)).toBeInTheDocument();
        expect(getByRole('link', { name: new RegExp(article.title, 'i') })).toHaveAttribute('href', article.path);
      });
    });
  });
});
