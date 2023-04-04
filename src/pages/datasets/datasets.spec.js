import React from 'react';
import renderer from 'react-test-renderer';
import DatasetsPage from "./index";
import PageHelmet from '../../components/page-helmet/page-helmet';
import SiteLayout from '../../components/siteLayout/siteLayout';
import BreadCrumbs from '../../components/breadcrumbs/breadcrumbs';
import { pageQueryMock } from '../../components/datasets/mockData/mockDatasets';
import * as Gatsby from 'gatsby';
import SearchField from "../../components/datasets/search-field/search-field";
import FilterSection from '../../components/datasets/filters/filters';
import { MuiThemeProvider } from "@material-ui/core";
import { mockFilters } from "../../components/datasets/mockData/mockFilters";

const useStaticQueryMock = jest.spyOn(Gatsby, 'useStaticQuery');
useStaticQueryMock.mockImplementation(() => (pageQueryMock));
jest.mock('../../helpers/metadata/use-metadata-updater-hook');
jest.mock('../../components/truncate/truncate.jsx', () => () => 'Truncator');
jest.mock('../../helpers/metadata/use-metadata-updater-hook', () => ({
  useMetadataUpdater: jest.fn().mockImplementation((i) => {
    return i;
  })
}));

describe('Dataset Page', () => {
  let component, instance, filterComponent, searchField;

  jest.useFakeTimers();

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  beforeAll(() => {

    renderer.act(() => {
      component = renderer.create(
        <DatasetsPage pageContext={{
          filters: mockFilters
        }}
        />
      );
      jest.runAllTimers();
    }
    );
    jest.runAllTimers();
    instance = component.root;
    filterComponent = instance.find(e => e.type === FilterSection);
    searchField = instance.find(e => e.type === SearchField);
  });

  const clearSearch = () => {
    renderer.act(() => {
      searchField.props.changeHandler('');
    });
  }

  it('lives within the site layout', () => {
    expect(instance.children[0].type).toBe(SiteLayout);
  });

  it('supplies the required values to the page helmet', () => {
    const helmet = instance.find(e => e.type === PageHelmet);
    expect(helmet.props.pageTitle).toBe('Dataset Search');
    expect(helmet.props.description).toBeDefined();
    expect(helmet.props.keywords).toBeDefined();
  });

  it('includes breadcrumbs', () => {
    const breadcrumbs = instance.find(e => e.type === BreadCrumbs);
    expect(breadcrumbs).toBeDefined();
  });

  it('displays the page title', () => {
    const title = instance.findByProps({ 'data-testid': 'page-title' });
    expect(title.props.children).toBe('Datasets');
  });

  it('initially passes all datasets to the filter component', () => {
    expect(filterComponent.props.searchResults.length)
      .toBe(pageQueryMock.allDatasets.datasets.length);
  });

  it('filters datasets when search is activated', async () => {
    expect(filterComponent.props.searchResults.length).toBe(3);

    renderer.act(() => {
      searchField.props.changeHandler('asdfasdfasdfasdfasdf');
    });

    expect(filterComponent.props.searchResults.length).toBe(0);

    // Revert search back to default state
    clearSearch();
  });

  it('includes the search field with change handler', () => {
    expect(typeof searchField.props.changeHandler).toBe('function');
  });

  it('establishes mui custom theming', () => {
    const mui = instance.findByType(MuiThemeProvider);

    expect(mui.props.theme).toBeDefined();
  });

  it('reports whether search is active or not', () => {
    expect(filterComponent.props.searchIsActive).toBeFalsy();

    renderer.act(() => {
      searchField.props.changeHandler('fiscal data is cool');
    });

    expect(filterComponent.props.searchIsActive).toBeTruthy();
    // Revert search back to default state
    clearSearch();
  });

});
