import React from 'react';
import { render } from '@testing-library/react';
import ExplainerRelatedDatasets from './explainer-related-datasets';
import { useStaticQuery } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';

const mockHeroImage = { layout: 'constrained', width: 400, height: 146, images: { fallback: { src: 'hero.png' } } };

const mockData = {
  allFile: {
    heroImages: ['Hero-0', 'Hero-1', 'Hero-2', 'Hero-3', 'Hero-4', 'Hero-5', 'Hero-6', 'Hero-7', 'Hero-8'],
  },
};

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

  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockData);
    jest.clearAllMocks();
    getImage.mockReturnValue(mockHeroImage);
  });

  it('renders related datasets with the proper datasets', async () => {
    const { getAllByTestId, findByText } = render(<ExplainerRelatedDatasets datasets={mockDatasets} referrer={testReferrer} />);

    const renderedDatasets = getAllByTestId('cardWrapper');
    expect(renderedDatasets).toBeDefined();
    expect(await findByText('1st Test Dataset')).toBeInTheDocument();
    expect(await findByText('2nd Test Dataset')).toBeInTheDocument();
  });
});
