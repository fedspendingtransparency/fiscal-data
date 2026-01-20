import React from 'react';
import FilterSection from './filters';
import { mockDatasets } from '../mockData/mockDatasets';
import { mockFilters } from '../mockData/mockFilters';
import { timeRangeCompleteAnalyticsObject } from './filterTimeRange/filterTimeRange';
import Analytics from '../../../utils/analytics/analytics';
import { siteContext } from '../../persist/persist';
import { cleanup, fireEvent, render, within } from '@testing-library/react';

jest.mock('../../../components/truncate/truncate.jsx', () => () => 'Truncator');

describe('Filter Main', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const setDateRangeTabSpy = jest.fn();

  let component,
    filters,
    isHandheld = false;

  beforeEach(() => {
    filters = mockFilters;
    component = (
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy,
        }}
      >
        <FilterSection
          searchResults={mockDatasets}
          allDatasets={mockDatasets}
          topicIcons={[]}
          availableFilters={filters}
          searchIsActive={true}
          searchQuery={[]}
          isHandheld={isHandheld}
        />
      </siteContext.Provider>
    );
  });

  afterEach(() => {
    cleanup();
  });

  it('The page title renders', () => {
    const { getByText } = render(component);
    expect(getByText('Filter Your Results')).toBeInTheDocument();
  });

  it('Applied custom date filter renders in filter summary', () => {
    const { getByLabelText } = render(component);
    expect(getByLabelText('10/01/2019 - 11/01/2021')).toBeInTheDocument();
  });

  it('places the last updated filter group', () => {
    const { getByTestId } = render(component);

    const filterWrapper = getByTestId('filter-wrapper');
    const lastUpdated = getByTestId('lastUpdatedFilter');
    const title = getByTestId('last-updated-title');

    expect(filterWrapper).toBeDefined();
    expect(lastUpdated).toBeDefined();
    expect(within(title).getByText('Last Updated')).toBeDefined();
  });

  it('places the file type filter group', () => {
    const { getByTestId } = render(component);

    const lastUpdated = getByTestId('dataFormatFilter');
    const title = getByTestId('data-format-title');
    expect(within(title).getByText('Data Format')).toBeDefined();
    expect(lastUpdated).toBeDefined();
  });

  it('places the start date filter group and the custom date range filter each under their tabs', () => {
    const { getByTestId } = render(component);

    const title = getByTestId('date-range-title');
    expect(title).toBeDefined();
    // first find custom date range filter since it's selected through persisted context
    const timeRangeFilter = getByTestId('time-range-filter');
    expect(timeRangeFilter).toBeDefined();
    // then switch tabs
    const dateFilterTabs = getByTestId('date-filter-tabs');
    expect(dateFilterTabs).toBeDefined();
    const filterTab = getByTestId('filter-tab-0');
    fireEvent.click(filterTab);
    // then find the start-date filter group
    const lastUpdated = getByTestId('startDateFilter');
    expect(lastUpdated).toBeDefined();
    expect(within(title).getByText('Date Range')).toBeDefined();
  });

  it('places the publisher filter group', () => {
    const { getByTestId } = render(component);

    const lastUpdated = getByTestId('publisherFilter');
    expect(lastUpdated).toBeDefined();
    const title = getByTestId('publisher-title');
    expect(title).toBeDefined();
    expect(within(title).getByText('Dataset Publisher')).toBeDefined();
  });

  it('places the topics filter group', () => {
    const { getByTestId } = render(component);

    const topicsTitle = getByTestId('topics-title');
    expect(topicsTitle).toBeDefined();
    expect(within(topicsTitle).getByText('Topics')).toBeDefined();
  });

  it('places the last updated reset control after a last updated filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const lastYearLabel = getByLabelText('lastYear');
    expect(lastYearLabel).toBeDefined();

    fireEvent.click(lastYearLabel);

    const control = getByTestId('lastUpdatedReset');
    expect(control).toBeDefined();
  });

  it('places the file type reset control after a file type filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const APILabel = getByLabelText('api');
    expect(APILabel).toBeDefined();

    fireEvent.click(APILabel);

    const control = getByTestId('dataFormatReset');
    expect(control).toBeDefined();
  });

  it('places the publisher reset control after a publisher filter has been selected', () => {
    const { getByTestId, getByLabelText } = render(component);

    const pubLabel = getByLabelText('adminResourceCenter');
    expect(pubLabel).toBeDefined();

    fireEvent.click(pubLabel);

    const control = getByTestId('publisherReset');
    expect(control).toBeDefined();
  });

  it('places the topics reset control after a topics filter has been selected', () => {
    const { getByTestId } = render(component);

    const searchLayout = getByTestId('search-layout');

    expect(searchLayout).toBeInTheDocument();

    const debtLabel = within(searchLayout).getByLabelText('savingsBonds');
    expect(debtLabel).toBeDefined();

    fireEvent.click(debtLabel);

    const control = getByTestId('topicsReset');
    expect(control).toBeDefined();
  });

  it('group filter is removed when group reset is called', () => {
    const { getByTestId, getByLabelText, getByText } = render(component);

    const reset = getByText('Clear All Filters');

    fireEvent.click(reset);

    const lastYearLabel = getByLabelText('lastYear');
    expect(lastYearLabel).toBeDefined();

    fireEvent.click(lastYearLabel);

    const filter = getByText('Last Updated:');

    expect(filter).toBeInTheDocument();

    const control = getByTestId('lastUpdatedReset');

    fireEvent.click(control);

    expect(filter).not.toBeInTheDocument();
  });

  it('filters datasets according to filter settings', () => {
    const { getByTestId, getByLabelText, getByText } = render(component);

    const reset = getByText('Clear All Filters');

    fireEvent.click(reset);

    const lastYearLabel = getByLabelText('lastYear');
    expect(lastYearLabel).toBeDefined();

    fireEvent.click(lastYearLabel);

    const searchResults = getByTestId('search-results');

    expect(searchResults).toBeInTheDocument();

    expect(within(searchResults).getByText('Showing 2 of 3 Datasets, 4 of 6 Data Tables')).toBeInTheDocument();

    const ninetyDaysLabel = getByLabelText('ninetyDays');
    expect(ninetyDaysLabel).toBeDefined();

    fireEvent.click(ninetyDaysLabel);

    expect(within(searchResults).getByText('Showing 2 of 3 Datasets, 4 of 6 Data Tables')).toBeInTheDocument();

    const CSVLabel = getByLabelText('csv');
    expect(CSVLabel).toBeDefined();

    fireEvent.click(CSVLabel);

    expect(within(searchResults).getByText('Showing 1 of 3 Datasets, 1 of 6 Data Tables')).toBeInTheDocument();

    fireEvent.click(ninetyDaysLabel);

    expect(within(searchResults).getByText('Showing 1 of 3 Datasets, 1 of 6 Data Tables')).toBeInTheDocument();
  });

  it('tallies datasets matching filters', () => {
    const { getAllByTestId, getByText } = render(component);

    const reset = getByText('Clear All Filters');

    fireEvent.click(reset);

    expect(getAllByTestId('filter-count')[0].innerHTML).toContain('2');
    expect(getAllByTestId('filter-count')[1].innerHTML).toContain('0');
    expect(getAllByTestId('filter-count')[2].innerHTML).toContain('0');
    expect(getAllByTestId('filter-count')[3].innerHTML).toContain('1');
    expect(getAllByTestId('filter-count')[4].innerHTML).toContain('2');
    expect(getAllByTestId('filter-count')[5].innerHTML).toContain('0');
    expect(getAllByTestId('filter-count')[6].innerHTML).toContain('2');
    expect(getAllByTestId('filter-count')[7].innerHTML).toContain('0');
  });

  it('triggers a tracking event when a custom time range is set', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByTestId } = render(component);
    const dateFilterTabs = getByTestId('date-filter-tabs');
    expect(dateFilterTabs).toBeDefined();
    const filterTab = getByTestId('filter-tab-1');
    fireEvent.click(filterTab);
    const timeRangeFilter = getByTestId('time-range-filter');
    expect(timeRangeFilter).toBeDefined();
    fireEvent.click(timeRangeFilter);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(timeRangeCompleteAnalyticsObject);
  });

  it('persists the tab selection for the Date Range Filters', () => {
    const { getByTestId } = render(component);
    const dateFilterTabs = getByTestId('date-filter-tabs');
    expect(dateFilterTabs).toBeDefined();
    const filterTabOne = getByTestId('filter-tab-1');
    const filterTabZero = getByTestId('filter-tab-0');
    fireEvent.click(filterTabZero);
    expect(setDateRangeTabSpy).toHaveBeenLastCalledWith(0);
    fireEvent.click(filterTabOne);
    expect(setDateRangeTabSpy).toHaveBeenLastCalledWith(1);
  });

  it(`persists state of the custom date range filter when it is reset and informs the
    child control accordingly`, () => {
    const { getByTestId, getByLabelText } = render(component);
    const timeRangeFilter = getByTestId('time-range-filter');
    expect(timeRangeFilter).toBeDefined();
    const fromDateInput = getByLabelText('From Date');
    expect(fromDateInput).toBeInTheDocument();
    const toDateInput = getByLabelText('To Date');
    expect(toDateInput).toBeInTheDocument();

    fireEvent.change(fromDateInput, { target: { value: '09/02/2019' } });
    fireEvent.change(toDateInput, { target: { value: '10/02/2020' } });

    const control = getByTestId('dateRangeReset');

    expect(control).toBeInTheDocument();

    fireEvent.click(control);

    expect(setBeginDateSpy).toHaveBeenLastCalledWith(null);
    expect(setEndDateSpy).toHaveBeenLastCalledWith(null);
    expect(setExactRangeSpy).toHaveBeenLastCalledWith(false);
    expect(control).not.toBeInTheDocument();
  });

  it('shows toggle button when using mobile device', () => {
    component = (
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy,
        }}
      >
        <FilterSection
          searchResults={mockDatasets}
          allDatasets={mockDatasets}
          topicIcons={[]}
          availableFilters={filters}
          searchIsActive={true}
          searchQuery={[]}
          isHandheld={true}
        />
      </siteContext.Provider>
    );
    const { getByTestId } = render(component);
    const mobileToggle = getByTestId('mobile-filter-toggle');
    expect(mobileToggle).toBeDefined();
  });

    it('captures clicks on filter info tips', () => {
      window.dataLayer = window.dataLayer || [];
      const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

      const { getAllByTestId } = render(
        <siteContext.Provider
          value={{
            beginDate: new Date(2019, 9, 1),
            setBeginDate: setBeginDateSpy,
            endDate: new Date(2021, 10, 1),
            setEndDate: setEndDateSpy,
            exactRange: true,
            setExactRange: setExactRangeSpy,
            dateRangeTab: 1,
            setDateRangeTab: setDateRangeTabSpy,
          }}
        >
          <FilterSection
            searchResults={mockDatasets}
            allDatasets={mockDatasets}
            topicIcons={[]}
            availableFilters={filters}
            searchIsActive={true}
            searchQuery={[]}
            isHandheld={isHandheld}
          />
        </siteContext.Provider>
      );

      const infoButtons = getAllByTestId('infoTipButton')

      const expectedLabels = [
        'Last Updated',
        'Date Range',
        'Time Range',
        'Dataset Publisher',
        'Data Format'
      ];

      expectedLabels.forEach((label, i) => {
        fireEvent.click(infoButtons[i]);

        expect(datalayerSpy).toHaveBeenCalledWith({
          event: 'Info Button Click',
          eventLabel: 'Last Updated',
        });
      })

      console.log(infoButtons.map(b => b.getAttribute('aria-label')));
    });
});

describe('GA4 test of datalayer push', () => {
  HTMLCanvasElement.prototype.getContext = jest.fn();
  const setBeginDateSpy = jest.fn();
  const setEndDateSpy = jest.fn();
  const setExactRangeSpy = jest.fn();
  const setDateRangeTabSpy = jest.fn();

  const isHandheld = false;
  const filters = mockFilters;

  it('trigger GA4 datalayer push testing', () => {
    window.dataLayer = window.dataLayer || [];
    const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

    const { getAllByTestId } = render(
      <siteContext.Provider
        value={{
          beginDate: new Date(2019, 9, 1),
          setBeginDate: setBeginDateSpy,
          endDate: new Date(2021, 10, 1),
          setEndDate: setEndDateSpy,
          exactRange: true,
          setExactRange: setExactRangeSpy,
          dateRangeTab: 1,
          setDateRangeTab: setDateRangeTabSpy,
        }}
      >
        <FilterSection
          searchResults={mockDatasets}
          allDatasets={mockDatasets}
          topicIcons={[]}
          availableFilters={filters}
          searchIsActive={true}
          searchQuery={[]}
          isHandheld={isHandheld}
        />
      </siteContext.Provider>
    );

    expect(getAllByTestId('infoTipButton')[0]).toBeInTheDocument();
    fireEvent.click(getAllByTestId('infoTipButton')[0]);

    expect(datalayerSpy).toHaveBeenCalledWith({
      event: 'Info Button Click',
      eventLabel: 'Last Updated',
    });
  });
});
