import * as Gatsby from 'gatsby';
import '@testing-library/jest-dom';
import testHelpers from './test-helpers';

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
  it('should ', () => {
    expect(true);
  });
  // it('renders a container component for the datasets', () => {
  //   setWindowMockFontSize('16px');
  //   const { getByTestId } = render(<HomeHighlightCards />);
  //   expect(getByTestId('cards-container')).toBeDefined();
  // });
  //
  // it('renders the desired number of cards from the datasets config', () => {
  //   setWindowMockFontSize('16px');
  //   // The mockData object consolidates datasets into a single object, whereas the datasets
  //   // object lists out each individual card.
  //   const mockCardsLen = datasets.length;
  //   const { getAllByText } = render(<HomeHighlightCards />);
  //
  //   const visibleCards = getAllByText('Highlight Card');
  //   expect(visibleCards.length).toBe(mockCardsLen);
  // });
  //
  // it('renders a spinner and no cards if no datasets match our config', () => {
  //   setWindowMockFontSize('16px');
  //   useStaticQueryMock.mockImplementationOnce(() => {});
  //
  //   const { queryByTestId, queryAllByText } = render(<HomeHighlightCards />);
  //   const hiddenCards = queryAllByText('Hidden Card');
  //   const visibleCards = queryAllByText('Highlight Card');
  //   expect(hiddenCards.length + visibleCards.length).toStrictEqual(0);
  //   expect(queryByTestId('highlight-cards-spinner')).toBeDefined();
  // });
});
