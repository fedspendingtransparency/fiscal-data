import React from 'react';
import * as Gatsby from 'gatsby';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomeHighlightCards, { baseFontSize, cardWidthRem } from './home-highlight-cards';
import testHelpers from './test-helpers';
import datasets from './highlighted-datasets-config';
import { setWindowMockFontSize } from '../../utils/mock-utils';

const mockData = testHelpers.getMockHighlightCardsData();

const useStaticQueryMock = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQueryMock.mockImplementation(() => ({
  allDatasets: {
    datasets: mockData,
  },
}));

jest.mock('./home-highlight-card/home-highlight-card', function() {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ hidden }) => (hidden ? 'Hidden Card' : 'Highlight Card')),
  };
});

jest.useFakeTimers();

describe('Home Highlight Cards', () => {
  it('renders a container component for the datasets', () => {
    setWindowMockFontSize('16px');
    const { getByTestId, getByText } = render(<HomeHighlightCards />);
    expect(getByTestId('cards-container')).toBeDefined();
    expect(getByText('Show More')).toBeDefined();
  });

  it('renders the desired number of cards from the datasets config', () => {
    setWindowMockFontSize('16px');
    // The mockData object consolidates datasets into a single object, whereas the datasets
    // object lists out each individual card.
    const mockCardsLen = datasets.length;
    const { getAllByText } = render(<HomeHighlightCards />);

    const visibleCards = getAllByText('Highlight Card');
    expect(visibleCards.length).toBeLessThan(mockCardsLen);
  });

  it('hides the desired number of cards based on screen dimensions', () => {
    setWindowMockFontSize('16px');
    const { getByTestId, queryAllByText } = render(<HomeHighlightCards />);
    const containerDiv = getByTestId('highlight-cards-parent');
    const cardWidth = baseFontSize * cardWidthRem;
    // The mockData object consolidates datasets into a single object, whereas the datasets
    // object lists out each individual card.
    const mockCardsLen = datasets.length;
    const numVisibleCards = 2;

    // Simulate screen size adjusted so that only 2 cards will appear on each line (and 2
    // cards shown by default).
    jest.spyOn(containerDiv, 'clientWidth', 'get').mockReturnValue(numVisibleCards * cardWidth);
    act(() => {
      global.window.dispatchEvent(new Event('resize'));
      jest.runAllTimers();
    });

    expect(queryAllByText('Highlight Card').length).toStrictEqual(numVisibleCards);

    // zero hidden because we not rendering them to the dom.
    expect(queryAllByText('Hidden Card').length).toStrictEqual(0);
  });

  it('displays elements as expected when the container is collapsed', () => {
    setWindowMockFontSize('16px');
    const { getByTestId, getAllByText } = render(<HomeHighlightCards />);
    const mockCardsLen = datasets.length;
    const button = getByTestId('collapse-button');
    act(() => {
      button.click();
    });
    const visibleCards = getAllByText('Highlight Card');
    expect(visibleCards.length).toBe(mockCardsLen);
  });

  it('renders a spinner and no cards if no datasets match our config', () => {
    setWindowMockFontSize('16px');
    useStaticQueryMock.mockImplementationOnce(() => {});

    const { queryByTestId, queryAllByText } = render(<HomeHighlightCards />);
    const hiddenCards = queryAllByText('Hidden Card');
    const visibleCards = queryAllByText('Highlight Card');
    expect(hiddenCards.length + visibleCards.length).toStrictEqual(0);
    expect(queryByTestId('highlight-cards-spinner')).toBeDefined();
  });
});
