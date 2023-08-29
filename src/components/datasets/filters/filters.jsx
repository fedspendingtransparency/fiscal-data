import React, { useState, useRef, useEffect, useContext } from "react";
import FilterGroup from "./filterGroup/filterGroup";
import Topics from '../topics/topics';
import {
  filtersIndexedById,
  filtersByGroupId,
  filterByDateRange
} from "../../../transform/filters/filterDefinitions";
import { siteContext } from "../../persist/persist";
import InfoTip, { infoTipAnalyticsObject } from "../../info-tip/info-tip";
import FilterGroupReset from "./filterGroupReset/filterGroupReset";
import SearchResults from '../search-results/search-results';
import FilterPublisher from "./filterPublisherWrapper/filterPublisher";
import DateFilterTabs from './dateFilterTabs/dateFilterTabs'
import FilterTimeRange, {
  timeRangeCompleteAnalyticsObject
} from './filterTimeRange/filterTimeRange';
import SearchFilterSummary from './searchFilterSummary/searchFilterSummary';
import MobileFilterToggle from './mobileFilterToggle/mobileFilterToggle';
import Analytics from '../../../utils/analytics/analytics';
import * as layoutStyles from './search-layout.module.scss';
import * as styles from './filters.module.scss';

export const lastUpdatedAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Last Updated Filter Click',
  // GA4 event
  event:'Last Updated Filter Click'
}

export const lastUpdatedInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Last Updated'
}

export const dateRangeAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Date Range Click',
  // GA4 event
  event:'Start Date Range Click'
}

export const dateRangeInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Date Range'
}

export const datasetPublisherAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Publisher Filter Click',
  // GA4 event
  event: 'Publisher Filter Click'
}

export const datasetPublisherInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Dataset Publisher'
}

export const dataFormatAnalyticsObject = {
  category: 'Dataset Search Page',
  action: 'Data Format Filter Click',
  // GA4 event
  event: 'Data Format Filter Click'
}

export const dataFormatInfoTipAnalyticsObject = {
  ...infoTipAnalyticsObject,
  label: 'Data Format'
}

const FilterSection = ({
  searchResults,
  searchIsActive,
  maxDate,
  searchQuery,
  isHandheld,
  allDatasets: updatedDatasets,
  topicIcons,
  availableFilters
}) => {
  const context = useContext(siteContext);
  const {dateRangeTab, setBeginDate, setEndDate, setExactRange, setDateRangeTab} = context;
  const [filterList, setFilterList] = useState(availableFilters);
  const [filteredDatasets, setFilteredDatasets] = useState(searchResults);
  const [filterTally, setFilterTally] = useState({});
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedTab, setSelectedTab] = useState(context ? dateRangeTab : 0);
  const [datasetsView, setDatasetsView] = useState(true);
  const [dateRangeResetApplied, setDateRangeResetApplied] = useState(false);

  const setFilterValues = (list) => {
    const filtersIndexedByIdValues = filtersIndexedById(filterList);

    list.forEach(item => {
      const i = filtersIndexedByIdValues[item.key];
      filterList[i]['active'] = item.val;
    });

    const activeFilters = filterList.filter(filter => filter.active).map(filter => filter.id);

    setActiveFilters(activeFilters);
    setFilterList(filterList);
  };

  const handleDateRange = (update, onlyCheckboxChange) => {
    // val should be set to update
    setFilterValues([{
      key: "customDateRange",
      val: update.active ? update : null
    }]);

    if (update.active && !onlyCheckboxChange) {
      Analytics.event(selectedTab === 0
        ? dateRangeAnalyticsObject
        : timeRangeCompleteAnalyticsObject
      );
      setDateRangeResetApplied(false);
    }
  };

  const onChange = (update) => {
    setFilterValues([{key: update.key, val: update.value}]);
  };

  const tips = {
    lastUpdated: {
      title: 'Last Updated',
      body: `
        Last Updated filters for datasets that have been updated within the selected time period.
      `
    },
    dateRange: {
      title: 'Date Range',
      body: (
        <>
          <p>
            The <strong>Start Date</strong> tab filters for datasets whose first record falls within
            the selected year range.
          </p>
          <p>
            The <strong>Time Range</strong> tab filters for datasets with at least one record that
            falls within the dates selected.
          </p>
        </>
      )
    },
    publisher: {
      title: "Dataset Publisher",
      body: (
        <>
          <p>
            Dataset Publisher filters for datasets by entity within the U.S.
            Department of the Treasury's organizational structure.
          </p>
        </>
      ),
    },
    dataFormat: {
      title: 'Data Format',
      body: (
        <p>
          Data Format filters for datasets with the selected options to access the data or published
          report.
        </p>
      )
    }
  };

  const onGroupReset = (id) => {
    const group = filtersByGroupId(id, filterList);

    setFilterValues(group.map(filter => {
      return {key: filter.id, val: false}
    }));

    if (id === "dateRange") {
      setBeginDate(null);
      setEndDate(null);
      setExactRange(false);
      setDateRangeResetApplied(true);
    }
  };

  const onIndividualReset = (selection) => {
    setFilterValues([{key: selection.id, val: false}]);
  };

  const calculateFilterCount = (filterGroupMatches, searchResults) => {
    const filterCounts = {total: searchResults.length};

    if (filterGroupMatches === {}) {
      filterList.forEach(filter => {
        const count = searchResults.filter(dataset => dataset.filterSet.has(filter.id)).length;
        if (count) {
          filterCounts[filter.id] = count;
        }
      });
    } else {
      filterList.forEach((filter) => {
        const allOtherFilterGroupIds = Object.keys(filterGroupMatches)
          .filter(groupId => groupId !== filter.groupId);
        const matchListsFromAllOtherFilterGroups = allOtherFilterGroupIds
          .map(groupId => filterGroupMatches[groupId]);
        const matchesOnEveryOtherGroupList = searchResults
          .filter(dataset => matchListsFromAllOtherFilterGroups.every(fSet => fSet.has(dataset)));
        const count = matchesOnEveryOtherGroupList
          .filter(dataset => dataset.filterSet.has(filter.id)).length;
        if (count) {
          filterCounts[filter.id] = count;
        }
      });
    }
    return filterCounts;
  }

  const matchesDateRange = (dataset) => {
    const dateRangeFilterActive = activeFilters.findIndex(r => r === "customDateRange") !== -1
    if (!dateRangeFilterActive) {
      return true
    } else {
      const custDateRange = filterList.find(f => f.id === "customDateRange");
      return filterByDateRange({dataset: dataset, options: custDateRange.active})
    }
  }

  const determineFilterGroupMatches = (results) => {
    // this function applies the OR logic WITHIN filter groups, including custom date range
    const activeGroups = getActiveGroups();
    const matches = {};
    Object.entries(activeGroups).forEach(([groupId, actives]) => {
      if (groupId === 'dateRange') {
        matches[groupId] = new Set(results.filter(dataset => matchesDateRange(dataset)));
      } else {
        matches[groupId] = new Set(
          results.filter(dataset => actives.some(filter => dataset.filterSet.has(filter.id)))
        );
      }
    });
    return matches;
  }

  const runFilters = () => {
    if (searchResults) {
      if (!activeFilters.length) {
        setFilteredDatasets(searchResults);
        setFilterTally(calculateFilterCount({}, searchResults));
      } else {
        const filterGroupMatches = determineFilterGroupMatches(searchResults);
        // this line applies the AND logic BETWEEN filter groups
        setFilteredDatasets(
          searchResults
            .filter(dataset => Object.values(filterGroupMatches)
              .every(matchSet => matchSet.has(dataset)))
        );
        setFilterTally(calculateFilterCount(filterGroupMatches, searchResults));
      }
    }
  }

  const setFilterSetOnDatasets = (updatedDatasets) => {
    updatedDatasets.forEach(ds => ds.filterSet = new Set(ds.filters));
  };

  const handleInfoTipClick = (label) => {

    // GA4 event
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'Info Button Click',
      'eventLabel': label
    });

    switch (label) {
      case tips.lastUpdated.title:
        Analytics.event(lastUpdatedInfoTipAnalyticsObject);
        break;
      case tips.dateRange.title:
        Analytics.event(dateRangeInfoTipAnalyticsObject);
        break;
      case tips.publisher.title:
        Analytics.event(datasetPublisherInfoTipAnalyticsObject);
        break;
      case tips.dataFormat.title:
        Analytics.event(dataFormatInfoTipAnalyticsObject);
        break;
      default:
        return;
    }
  }

  useEffect(() => {
    if (!updatedDatasets) return;
    setFilterList(availableFilters);
    setFilterSetOnDatasets(updatedDatasets);
    runFilters();
  }, [updatedDatasets]);

  useEffect(runFilters, [searchResults, activeFilters]);

  const selectedTabChangeHandler = (selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
    if (context) {
      setDateRangeTab(selectedTabIndex);
    }
  };

  const getActiveGroups = () => {
    const activeGroups = {};
    activeFilters.forEach(a => {
      const filter = filterList.find(r => r.id === a);
      if (!activeGroups[filter.groupId]) {
        activeGroups[filter.groupId] = [];
      }
      activeGroups[filter.groupId].push(filter);
    })
    return activeGroups;
  }

  const mobileFiltersReset = () => {
    const groups = getActiveGroups();
    Object.keys(groups).map(g => onGroupReset(g));
  }

  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
  const scrollRef = useRef();

  return (
    <>
      <SearchFilterSummary
        searchQuery={searchQuery}
        onIndividualReset={onIndividualReset}
        onGroupReset={onGroupReset}
        activeFilters={activeFilters}
        allFilters={availableFilters}
      />
      <div className={layoutStyles.searchLayout} ref={scrollRef}>
        {(!isHandheld || (isHandheld && !datasetsView)) && (
          <div
            className={`${layoutStyles.searchLayoutSection} ${layoutStyles.searchLayoutFilters}`}
          >
            <section>
              <h1 className={styles.title}>Filter Your Results</h1>
              <div className={styles.filterWrapper}>
                <div className={styles.filterSectionHeader}>
                  <h2
                    className={styles.filterSectionTitle}
                    data-testid="last-updated-title"
                  >
                    Last Updated
                  </h2>
                  <InfoTip
                    data-testid="last-updated-tip"
                    title={tips.lastUpdated.title}
                    clickEvent={() => handleInfoTipClick(tips.lastUpdated.title)}
                  >
                    {tips.lastUpdated.body}
                  </InfoTip>
                  <FilterGroupReset
                    data-testid="last-updated-reset"
                    groupId="lastUpdated"
                    activeFilters={activeFilters}
                    filters={availableFilters}
                    onGroupReset={onGroupReset}
                  />
                </div>
                <FilterGroup
                  data-testid="last-updated-group"
                  groupId="lastUpdated"
                  onChange={onChange}
                  currentFilters={filterList}
                  filterTally={filterTally}
                  analyticsObject={lastUpdatedAnalyticsObject}
                />
              </div>
              <hr className={styles.filterSectionDivider} />
              <div className={styles.filterWrapper}>
                <div className={styles.filterSectionHeader}>
                  <h2
                    className={styles.filterSectionTitle}
                    data-testid="date-range-title"
                  >
                    Date Range
                  </h2>
                  <InfoTip
                    data-testid="date-range-tip"
                    title={tips.dateRange.title}
                    clickEvent={() => handleInfoTipClick(tips.dateRange.title)}
                  >
                    {tips.dateRange.body}
                  </InfoTip>
                  <FilterGroupReset
                    data-testid="start-date-reset"
                    groupId={selectedTab === 1 ? "dateRange" : "startDate"}
                    activeFilters={activeFilters}
                    filters={availableFilters}
                    onGroupReset={onGroupReset}
                  />
                </div>
                <DateFilterTabs
                  selectedTab={selectedTab}
                  setSelectedTab={selectedTabChangeHandler}
                  onGroupReset={onGroupReset}
                  startDateComponent={
                    <FilterGroup
                      data-testid="start-date-group"
                      groupId="startDate"
                      onChange={onChange}
                      currentFilters={filterList}
                      filterTally={filterTally}
                      analyticsObject={dateRangeAnalyticsObject}
                    />
                  }
                  timeRangeComponent={
                    <FilterTimeRange
                      dateRangeFilter={handleDateRange}
                      maxAllowedDate={maxDate}
                      resetApplied={dateRangeResetApplied}
                    />
                  }
                />
              </div>
              <hr className={styles.filterSectionDivider} />
              <div className={styles.filterWrapper}>
                <div className={styles.filterSectionHeader}>
                  <h2
                    className={styles.filterSectionTitle}
                    data-testid="publisher-title"
                  >
                    Dataset Publisher
                  </h2>
                  <InfoTip
                    data-testid="publisher-tip"
                    title={tips.publisher.title}
                    clickEvent={() => handleInfoTipClick(tips.publisher.title)}
                  >
                    {tips.publisher.body}
                  </InfoTip>
                  <FilterGroupReset
                    data-testid="publisher-reset"
                    groupId="publisher"
                    activeFilters={activeFilters}
                    filters={availableFilters}
                    onGroupReset={onGroupReset}
                  />
                </div>
                <FilterPublisher filterList={filterList}>
                  <FilterGroup
                    data-testid="publisher-group"
                    groupId="publisher"
                    onChange={onChange}
                    currentFilters={filterList}
                    filterTally={filterTally}
                    analyticsObject={datasetPublisherAnalyticsObject}
                  />
                </FilterPublisher>
              </div>
              <hr className={styles.filterSectionDivider} />
              <div className={styles.filterWrapper}>
                <div className={styles.filterSectionHeader}>
                  <h2
                    className={styles.filterSectionTitle}
                    data-testid="data-format-title"
                  >
                    Data Format
                  </h2>
                  <InfoTip
                    data-testid="data-format-tip"
                    title={tips.dataFormat.title}
                    clickEvent={() => handleInfoTipClick(tips.dataFormat.title)}
                  >
                    {tips.dataFormat.body}
                  </InfoTip>
                  <FilterGroupReset
                    data-testid="data-format-reset"
                    groupId="dataFormat"
                    activeFilters={activeFilters}
                    filters={availableFilters}
                    onGroupReset={onGroupReset}
                  />
                </div>
                <FilterGroup
                  data-testid="data-format-group"
                  groupId="dataFormat"
                  onChange={onChange}
                  currentFilters={filterList}
                  filterTally={filterTally}
                  analyticsObject={dataFormatAnalyticsObject}
                />
              </div>
            </section>
          </div>
        )}
        {(!isHandheld || (isHandheld && datasetsView)) && (
          <div className={`${layoutStyles.searchLayoutSection} ${layoutStyles.searchLayoutMain}`}>
            <Topics
              data-testid="topics-group"
              activeFilters={activeFilters}
              availableFilters={availableFilters}
              groupId="topics"
              onChange={onChange}
              onGroupReset={onGroupReset}
              topicIcons={topicIcons}
            />
            {filteredDatasets && (
              <SearchResults
                data-testid="search-results"
                filteredDatasets={filteredDatasets}
                allDatasets={updatedDatasets}
                searchIsActive={searchIsActive}
              />
            )}
          </div>
        )}
      </div>
      {isHandheld && (
        <MobileFilterToggle
          data-testid="mobile-filter-toggle"
          datasetsCount={filteredDatasets ? filteredDatasets.length : 0}
          datasetsView={datasetsView}
          filterCnt={activeFilters.length}
          filterReset={mobileFiltersReset}
          toggleDatasetView={() => {
            scrollToRef(scrollRef)
            setDatasetsView(!datasetsView)
          }}
        />
      )}
    </>
  )
}

export default FilterSection;
