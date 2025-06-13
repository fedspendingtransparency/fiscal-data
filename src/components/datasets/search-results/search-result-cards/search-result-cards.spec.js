import React from 'react';
import { render } from '@testing-library/react';
import SearchResultCards from './search-result-cards';
import { SortOptions } from '../search-results-helper';
import { setWindowMockFontSize } from '../../../../utils/mock-utils';

const mockAllDatasets = [
  { name: 'Dataset A', datasetId: '0' },
  { name: 'Dataset B', datasetId: '1' },
  { name: 'Dataset C', datasetId: '2' },
  { name: 'Dataset D', datasetId: '3' },
  { name: 'Dataset E', datasetId: '4' },
];

const mockFilteredDatasets = [mockAllDatasets[0], mockAllDatasets[1], mockAllDatasets[2]];

const activeSort = SortOptions[1];
const mockSorter = jest.fn();
activeSort.sortFn = mockSorter;

describe('Search Results Cards', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  //   let component;
  setWindowMockFontSize('16px');
  //   renderer.act(() => {
  //     component = renderer.create(
  //       <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
  //     );
  //   });

  // const instance = component.root;

  it('creates a card for each item in the array of allDatasets', () => {
    const { getAllByTestId } = render(
      <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
    );
    expect(getAllByTestId('cardPlacement').length).toBe(mockAllDatasets.length);
  });

  it('applies hiddenCard className to datasets not in the filteredDatasets array', () => {
    const { getAllByTestId } = render(
      <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
    );
    const datasetCardsArray = getAllByTestId('cardPlacement');
    expect(datasetCardsArray[3]).toHaveClass('hiddenCard');
    expect(datasetCardsArray[4]).toHaveClass('hiddenCard');
  });

  it('adds the left:0% style to all hidden cards', () => {
    const { getAllByTestId } = render(
      <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
    );
    const datasetCardsArray = getAllByTestId('cardPlacement');
    expect(datasetCardsArray[3]).toHaveAttribute('style', 'left: 0%; top: 0px;');
    expect(datasetCardsArray[4]).toHaveAttribute('style', 'left: 0%; top: 0px;');
  });

  it('places cards by inline style', () => {
    const { getAllByTestId } = render(
      <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
    );
    const datasetCardsArray = getAllByTestId('cardPlacement');
    expect(datasetCardsArray[1]).toHaveAttribute('style', 'left: 0%; top: 382px;');
  });

  it('calls the active sort function', () => {
    render(<SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />);
    expect(mockSorter).toHaveBeenCalled();
  });

  it('sets the height for the container', () => {
    const { getByTestId } = render(
      <SearchResultCards allDatasets={mockAllDatasets} filteredDatasets={mockFilteredDatasets} activeSort={activeSort} width={100} />
    );
    expect(getByTestId('wrapper')).toHaveAttribute('style', 'height: 1146px;');
  });
});
