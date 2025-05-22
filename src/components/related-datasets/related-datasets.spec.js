import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import RelatedDatasets, { context, title } from './related-datasets';

const mockCards = [];
const sortedDataset1 = 'dataset b';
const sortedDataset2 = 'dataset f';
const sortedDataset3 = 'dataset w';

const mockRelatedDatasets = [{ name: sortedDataset3 }, { name: sortedDataset1 }, { name: sortedDataset2 }];

const referrer = 'Referring Dataset';

describe('RelatedDatasets', () => {
  beforeEach(() => {
    mockCards.length = 0;
  });

  afterEach(() => {
    cleanup();
  });
  it('should show the appropriate number of cards, and they should be in alphabetical order', () => {
    render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
    const datasetCards = screen.getAllByTestId('cardWrapper');
    expect(datasetCards).toHaveLength(3);
    expect(datasetCards[0]).toHaveTextContent(sortedDataset1);
    expect(datasetCards[1]).toHaveTextContent(sortedDataset2);
    expect(datasetCards[2]).toHaveTextContent(sortedDataset3);
  });
  it('should pass along its title param to the DatasetSectionContainer component', () => {
    render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
    expect(screen.getByTestId('sectionContainer').textContent).toContain(title);
  });

  it('should pass along context and referrer props to the Dataset Card for analytics', () => {
    render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);

    expect(mockCards[0].context).toBe(context);
    expect(mockCards[0].referrer).toBe(referrer);
  });
});
