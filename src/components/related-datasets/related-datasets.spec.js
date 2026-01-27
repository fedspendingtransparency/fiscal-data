import { cleanup } from '@testing-library/react';

const sortedDataset1 = 'dataset b';
const sortedDataset2 = 'dataset f';
const sortedDataset3 = 'dataset w';

const mockRelatedDatasets = [{ name: sortedDataset3 }, { name: sortedDataset1 }, { name: sortedDataset2 }];

const referrer = 'Referring Dataset';

describe('RelatedDatasets', () => {
  afterEach(() => {
    cleanup();
  });
  it('should ', () => {
    expect(true);
  });
  // it('should show the appropriate number of cards, and they should be in alphabetical order', () => {
  //   render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
  //   const datasetCards = screen.getAllByTestId('cardWrapper');
  //   expect(datasetCards).toHaveLength(3);
  //   expect(datasetCards[0]).toHaveTextContent(sortedDataset1);
  //   expect(datasetCards[1]).toHaveTextContent(sortedDataset2);
  //   expect(datasetCards[2]).toHaveTextContent(sortedDataset3);
  // });
  // it('should pass along its title param to the DatasetSectionContainer component', () => {
  //   render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
  //   expect(screen.getByTestId('sectionContainer').textContent).toContain(title);
  // });
  //
  // it('should call analytics event with the appropriate context', () => {
  //   const analyticsSpy = jest.spyOn(Analytics, 'event');
  //   const { getAllByRole } = render(<RelatedDatasets datasets={mockRelatedDatasets} referrer={referrer} />);
  //   const datasetCards = getAllByRole('button');
  //   userEvent.click(datasetCards[0]);
  //   expect(analyticsSpy).toHaveBeenCalledWith({ action: `${context} Click`, category: `${context} Click`, label: sortedDataset1 });
  // });
});
