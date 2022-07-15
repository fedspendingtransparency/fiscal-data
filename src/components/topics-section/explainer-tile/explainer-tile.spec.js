import React from 'react';
import { render } from "@testing-library/react"
import ExplainerTile from "./explainer-tile";

const testTiles = {
  'pageName': {
    title: 'Page title',
    body: 'Page description',
    altText: 'altText',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage',
    mainFeature: true,
    path: '/'
  },
  'anotherPage': {
    title: 'Page title',
    body: 'Page description',
    altText: 'altText',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage'
  }
};

const mockImages = {
  allFile: {
    topicsImages: [
      {
        name: 'testDesktopImage',
        childImageSharp: {
          gatsbyImageData: {

          }
        }
      },
      {
        name: 'testMobileImage',
        childImageSharp: {
          gatsbyImageData: {

          }
        }
      }
    ]
  }
};


jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointLg: 992
}));

describe('Explainer Tile', () => {

  it('renders a topics tile, with the title, body and image', () => {
    const { getByText, getByTestId, getByRole } = render(
      <ExplainerTile
        content={testTiles['pageName']}
        images={''}
        width={'1200'}
      />
    );

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
  });

  it('renders a topics tile for mobile view', () => {
    const { getByText, getByTestId, getByRole } = render(
      <ExplainerTile
        content={testTiles['pageName']}
        images={''}
        width={'400'}
      />
    );

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
  });

  it('wraps the tile in a link when a path is provided', () => {
    const { getByRole } = render(
      <ExplainerTile
        content={testTiles['pageName']}
        images={''}
        width={'1200'}
      />
    );

    const tileLink = getByRole('link');
    expect(tileLink).toBeInTheDocument();
    expect(tileLink).toHaveAttribute('href', '/');
  });

  it('does not wrap the tile in a link if a path is not provided', () => {
    const { queryByRole } = render(
      <ExplainerTile
        content={testTiles['anotherPage']}
        images={''}
        width={'1200'}
      />
      );
    const tileLink = queryByRole('link');
    expect(tileLink).not.toBeInTheDocument();
  });

  it('renders the tile images with the provided alternate text', () => {
    const { getByRole } = render(
      <ExplainerTile
        content={testTiles['pageName']}
        images={mockImages}
        width={'1200'}
      />
    );
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveAttribute('alt', 'altText');
  });
});
