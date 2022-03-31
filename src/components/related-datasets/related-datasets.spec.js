import React from 'react';

import RelatedDatasets, {context, title} from "./related-datasets";
import renderer from 'react-test-renderer';
import DatasetCard from '../dataset-card/dataset-card';
import { render } from "@testing-library/react";

describe('RelatedDatasets', () => {

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const sortedDataset1 = 'dataset b';
  const sortedDataset2 = 'dataset f';
  const sortedDataset3 = 'dataset w';

  const mockRelatedDatasets = [
    {
      name: sortedDataset3,
    },
    {
      name: sortedDataset1,
    },
    {
      name: sortedDataset2,
    },
  ];

  const referrer = 'Referring Dataset';

  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />
    );
  });

  const instance = component.root;

  it('should pass along its title param to the DatasetSectionContainer component', () => {
    const { getByTestId } = render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
    expect(getByTestId('sectionContainer').innerHTML).toContain(title);
  });

  it('should show the appropriate number of cards, and they should be in alphabetical order',
    () => {
      const { queryAllByTestId } = render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
      const datasetCards = queryAllByTestId('cardWrapper');
      expect(datasetCards.length).toBe(3);
      expect(datasetCards[0].innerHTML).toContain(sortedDataset1);
      expect(datasetCards[1].innerHTML).toContain(sortedDataset2);
      expect(datasetCards[2].innerHTML).toContain(sortedDataset3);
    }
  );

  it('should pass along context and referrer props to the Dataset Card for analytics', () => {
    const cards = instance.findAllByType(DatasetCard);
    expect(cards[0].props.context).toBe(context);
    expect(cards[0].props.referrer).toBe(referrer);
  });
});
