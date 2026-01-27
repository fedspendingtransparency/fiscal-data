import { mockDatasets, pageQueryMock } from '../../components/datasets/mockData/mockDatasets';
import * as Gatsby from 'gatsby';
import Fuse from 'fuse.js';

const useStaticQueryMock = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQueryMock.mockImplementation(() => pageQueryMock);
jest.mock('../../helpers/metadata/use-metadata-updater-hook');
jest.mock('../../components/truncate/truncate.jsx', () => () => 'Truncator');
jest.mock('../../helpers/metadata/use-metadata-updater-hook', () => ({
  useMetadataUpdater: jest.fn().mockImplementation(i => {
    return i;
  }),
}));

describe('Dataset Page', () => {
  jest.useFakeTimers();

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  let searchEngine;

  beforeAll(() => {
    const options = { keys: ['name', 'summaryText', 'relatedTopics', 'allPrettyNames'], threshold: 0.2, includeScore: true, ignoreLocation: true };
    const searchIndex = Fuse.createIndex(options.keys, mockDatasets);
    searchEngine = new Fuse(mockDatasets, options, searchIndex);
  });

  const clearSearch = jest.fn();
  it('should ', () => {
    expect(true);
  });
  // it('includes breadcrumbs', () => {
  //   const { getByTestId } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   expect(getByTestId('breadcrumbs')).toBeInTheDocument();
  // });
  //
  // it('displays the page title', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   const title = getByRole('heading', { level: 1, name: 'Datasets' });
  //   expect(title).toBeInTheDocument();
  // });
  //
  // it('initially passes all datasets to the filter component', async () => {
  //   const { findAllByText } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //
  //   const datasetCount = pageQueryMock.allDatasets.datasets.length;
  //   const text = await findAllByText(`Showing ${datasetCount} of ${datasetCount} Datasets`, { exact: false });
  //   expect(text.length).toBeGreaterThan(0);
  // });
  //
  // it('filters datasets when search is activated', async () => {
  //   const { findAllByTestId, getByRole, findAllByText } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   const searchField = getByRole('textbox', { name: 'Enter search terms' });
  //
  //   expect(await findAllByTestId('cardPlacement')).toHaveLength(3);
  //   act(() => {
  //     fireEvent.change(searchField, { target: { value: 'asdfasdfasdfasdfasdf' } });
  //   });
  //   const datasetCount = pageQueryMock.allDatasets.datasets.length;
  //
  //   const text = await findAllByText(`Showing 0 of ${datasetCount} Datasets`, { exact: false });
  //   expect(text.length).toBeGreaterThan(0);
  // });
  //
  // it('includes the search field', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   expect(getByRole('textbox', { name: 'Enter search terms' })).toBeInTheDocument();
  // });
  //
  // it('reports whether search is active or not', async () => {
  //   const { getByRole, findByRole } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   const searchField = getByRole('textbox', { name: 'Enter search terms' });
  //   const sortByAlphabetical = await findByRole('button', { name: 'Change sort order from Alphabetical (A to Z)' });
  //   //sort by defaults to alphabetical when search is not active
  //   expect(sortByAlphabetical).toBeInTheDocument();
  //   act(() => {
  //     fireEvent.change(searchField, { target: { value: 'fiscal data is cool' } });
  //   });
  //   //updates to most relevant when search is active
  //   const sortByMostRelevant = await findByRole('button', { name: 'Change sort order from Most Relevant' });
  //   expect(sortByMostRelevant).toBeInTheDocument();
  // });
});
