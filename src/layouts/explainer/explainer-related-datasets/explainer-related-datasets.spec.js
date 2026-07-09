import React from 'react';
import { render } from '@testing-library/react';
import ExplainerRelatedDatasets from './explainer-related-datasets';

describe('Explainer Related Datasets', () => {
  const mockDatasets = [
    {
      datasetId: 'Test1',
      name: '1st Test Dataset',
      slug: '1st Test Slug',
    },
    {
      datasetId: 'Test2',
      name: '2nd Test Dataset',
      slug: '2nd Test Slug',
    },
  ];

  const testReferrer = 'Sample';

  it('renders related datasets with the proper datasets', () => {
    const { getAllByTestId, getByText } = render(<ExplainerRelatedDatasets datasets={mockDatasets} referrer={testReferrer} />);

    const renderedDatasets = getAllByTestId('cardWrapper');
    expect(renderedDatasets).toBeDefined();
    expect(getByText('1st Test Dataset')).toBeInTheDocument();
    expect(getByText('2nd Test Dataset')).toBeInTheDocument();
  });
});
