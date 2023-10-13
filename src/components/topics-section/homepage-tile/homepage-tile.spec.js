import React from 'react';
import { render, waitFor } from '@testing-library/react';
import ExplainerTile from './homepage-tile';
import { SpendingBodyGenerator } from './homepage-tile-helper';
import fetchMock from 'fetch-mock';
import { mockSpendingHeroData } from '../../../layouts/explainer/explainer-test-helper';

const testTiles = {
  pageName: {
    title: 'Page title',
    body: 'Page description',
    altText: 'altText',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage',
    mainFeature: true,
    path: '/',
  },
  anotherPage: {
    title: 'Page title',
    body: 'Page description',
    altText: 'altText',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage',
  },
};

const mockImages = {
  allFile: {
    topicsImages: [
      {
        name: 'testDesktopImage',
        childImageSharp: {
          gatsbyImageData: {},
        },
      },
      {
        name: 'testMobileImage',
        childImageSharp: {
          gatsbyImageData: {},
        },
      },
    ],
  },
};

jest.mock('./variables.module.scss', content => ({
  ...content,
  breakpointLg: 992,
}));

describe('Explainer Tile', () => {
  it('renders a topics tile, with the title, body and image', () => {
    const { getByText, getByTestId, getByRole } = render(<ExplainerTile content={testTiles['pageName']} images={''} width={'1200'} />);

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
  });

  it('renders a topics tile for mobile view', () => {
    const { getByText, getByTestId, getByRole } = render(<ExplainerTile content={testTiles['pageName']} images={''} width={'400'} />);

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    expect(getByRole('presentation')).toBeInTheDocument();
  });

  it('wraps the tile in a link when a path is provided', () => {
    const { getByRole } = render(<ExplainerTile content={testTiles['pageName']} images={''} width={'1200'} />);

    const tileLink = getByRole('link');
    expect(tileLink).toBeInTheDocument();
    expect(tileLink).toHaveAttribute('href', '/');
  });

  it('does not wrap the tile in a link if a path is not provided', () => {
    const { queryByRole } = render(<ExplainerTile content={testTiles['anotherPage']} images={''} width={'1200'} />);
    const tileLink = queryByRole('link');
    expect(tileLink).not.toBeInTheDocument();
  });

  it('renders the tile images with the provided alternate text', () => {
    const { getByRole } = render(<ExplainerTile content={testTiles['pageName']} images={mockImages} width={'1200'} />);
    expect(getByRole('presentation')).toBeInTheDocument();
    expect(getByRole('presentation')).toHaveAttribute('alt', 'altText');
  });
});

describe('Spending Body Generator ', () => {
  it('renders the amount and year', async () => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    const { getByText } = render(<SpendingBodyGenerator />);
    await waitFor(() => getByText('$4.52 trillion', { exact: false }));
    expect(await getByText('in fiscal year 2022', { exact: false })).toBeInTheDocument();
  });
});
