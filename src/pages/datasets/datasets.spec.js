import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import DatasetsPage from './index';
import { mockDatasets, pageQueryMock } from '../../components/datasets/mockData/mockDatasets';
import * as Gatsby from 'gatsby';
import { mockFilters } from '../../components/datasets/mockData/mockFilters';
import { RecoilRoot } from 'recoil';
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
  let component, instance, filterComponent, searchField;

  jest.useFakeTimers();

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  let searchEngine;

  beforeAll(() => {
    const options = { keys: ['name', 'summaryText', 'relatedTopics', 'allPrettyNames'], threshold: 0.2, includeScore: true, ignoreLocation: true };
    const searchIndex = Fuse.createIndex(options.keys, mockDatasets);
    searchEngine = new Fuse(mockDatasets, options, searchIndex);
  });

  // beforeAll(() => {
  // renderer.act(() => {
  //   component = renderer.create(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   jest.runAllTimers();
  // });
  // jest.runAllTimers();
  // instance = component.root;
  // filterComponent = instance.find(e => e.type === FilterSection);
  // searchField = instance.find(e => e.type === SearchField);
  // });

  const clearSearch = jest.fn();

  it('includes breadcrumbs', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DatasetsPage
          pageContext={{
            filters: mockFilters,
          }}
        />
      </RecoilRoot>
    );
    expect(getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('displays the page title', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetsPage
          pageContext={{
            filters: mockFilters,
          }}
        />
      </RecoilRoot>
    );
    const title = getByRole('heading', { level: 1, name: 'Datasets' });
    expect(title).toBeInTheDocument();
  });

  // it('initially passes all datasets to the filter component', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   expect(filterComponent.props.searchResults.length).toBe(pageQueryMock.allDatasets.datasets.length);
  // });

  it('filters datasets when search is activated', async () => {
    const { findAllByTestId, getByRole } = render(
      <RecoilRoot>
        <DatasetsPage
          pageContext={{
            filters: mockFilters,
          }}
        />
      </RecoilRoot>
    );
    // expect(getByRole('button', { name: 'here' }));
    const searchField = getByRole('textbox', { name: 'Enter search terms' });

    expect(await findAllByTestId('cardPlacement')).toHaveLength(3);
    fireEvent.change(searchField, { target: { value: 'asdfasdfasdfasdfasdf' } });
    // expect(await findAllByTestId('cardPlacement')).toHaveLength(0);

    // renderer.act(() => {
    //   searchField.props.changeHandler('asdfasdfasdfasdfasdf');
    // });

    // expect(filterComponent.props.searchResults.length).toBe(0);

    // Revert search back to default state
    // clearSearch();
  });

  it('includes the search field', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DatasetsPage
          pageContext={{
            filters: mockFilters,
          }}
        />
      </RecoilRoot>
    );
    expect(getByRole('textbox', { name: 'Enter search terms' })).toBeInTheDocument();
  });

  // it('reports whether search is active or not', () => {
  //   const { getByRole } = render(
  //     <RecoilRoot>
  //       <DatasetsPage
  //         pageContext={{
  //           filters: mockFilters,
  //         }}
  //       />
  //     </RecoilRoot>
  //   );
  //   const searchField = getByRole('textbox', { name: 'Enter search terms' });
  //   // expect(filterComponent.props.searchIsActive).toBeFalsy();
  //
  //   renderer.act(() => {
  //     searchField.props.changeHandler('fiscal data is cool');
  //   });
  //
  //   expect(filterComponent.props.searchIsActive).toBeTruthy();
  //   // Revert search back to default state
  //   clearSearch();
  // });
});
