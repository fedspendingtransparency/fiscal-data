import React from 'react';
import { render } from "@testing-library/react"
import ExplainerTile from "./explainer-tile";

const testTiles = {
  'pageName': {
    title: 'Page title',
    body: 'Page description',
    altText: '',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage',
    mainFeature: true,
    path: '/'
  },
  'anotherPage': {
    title: 'Page title',
    body: 'Page description',
    altText: '',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage'
  }
};

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

  it('wraps the tile in a link when a path is provided', () => {
    const { getByText, getByTestId, getByRole } = render(
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

  it('does not wrap the tile in a link when a path is not provided', () => {
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

});
