import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import ExplainerTile from './homepage-tile';
import { SavingsBondsBodyGenerator, SpendingBodyGenerator } from './homepage-tile-helper';
import fetchMock from 'fetch-mock';
import { mockSavingsBondsData, mockSpendingHeroData } from '../../../layouts/explainer/explainer-test-helper';
import Analytics from '../../../utils/analytics/analytics';

const testTiles = {
  pageName: {
    title: 'Page title',
    body: 'Page description',
    altText: 'altText',
    desktopImage: 'testDesktopImage',
    mobileImage: 'testMobileImage',
    mainFeature: true,
    path: '/',
    analyticsName: 'Page Analytics',
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

global.___loader = {
  enqueue: jest.fn(),
  hovering: jest.fn(),
};

describe('Explainer Tile', () => {
  it('renders a topics tile, with the title, body and image', () => {
    const { getByText, getByTestId, getAllByRole } = render(<ExplainerTile content={testTiles['pageName']} images={''} width={'1200'} />);

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    const images = getAllByRole('presentation');

    expect(images).toHaveLength(2);
    expect(images[0]).toBeInTheDocument();
  });

  it('renders a topics tile for mobile view', () => {
    const { getByText, getByTestId, getAllByRole } = render(<ExplainerTile content={testTiles['pageName']} images={''} width={'400'} />);

    expect(getByTestId('tile')).toBeInTheDocument();
    expect(getByText('Page title')).toBeInTheDocument();
    expect(getByText('Page description')).toBeInTheDocument();
    const images = getAllByRole('presentation');

    expect(images).toHaveLength(2);
    expect(images[0]).toBeInTheDocument();
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
    const { getAllByRole } = render(<ExplainerTile content={testTiles['pageName']} images={mockImages} width={'1200'} />);
    const images = getAllByRole('presentation');

    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('alt', 'altText');
    expect(images[1]).toHaveAttribute('alt', 'altText');
  });

  it('calls the appropriate analytics event when the mouse hovers over the tile', async () => {
    jest.useFakeTimers();
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(<ExplainerTile content={testTiles['pageName']} images={mockImages} width={'1200'} />);
    const tileLink = await waitFor(() => getByTestId('tile-link'));
    expect(tileLink).toBeInTheDocument();
    fireEvent.mouseOver(tileLink);
    jest.runAllTimers();
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith({
        category: 'Homepage Cards',
        action: 'Card Hover',
        label: 'Page Analytics',
      })
    );
    fireEvent.mouseLeave(tileLink);
  });

  it('calls the appropriate analytics event when the mouse clicks on the homepage tile', async () => {
    jest.useFakeTimers();
    window.___navigate = jest.fn();
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(<ExplainerTile content={testTiles['pageName']} images={mockImages} width={'1200'} />);
    const tileLink = await waitFor(() => getByTestId('tile-link'));
    expect(tileLink).toBeInTheDocument();
    fireEvent.click(tileLink);
    jest.runAllTimers();
    await waitFor(() =>
      expect(spy).toHaveBeenCalledWith({
        category: 'Homepage Navigation',
        action: 'Citation Click',
        label: 'Page Analytics',
      })
    );
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

describe('Savings Bonds Generator', () => {
  it('renders and amount', async () => {
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSavingsBondsData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    const { getByText } = render(<SavingsBondsBodyGenerator />);
    await waitFor(() => getByText('$7 billion', { exact: false }));
  });
});
