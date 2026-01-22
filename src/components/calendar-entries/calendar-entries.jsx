import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import {
  loadingIcon,
  mainContainer,
  dropdownContainer,
  dropdown,
  entriesContainer,
  pagination,
  releaseCalendarLegend,
  updateStatusIcon,
  notYetUpdated,
  releaseCalendarLegendGray,
} from './calendar-entries.module.scss';
import SelectControl from '../select-control/select-control';
import PageButtons from '../pagination/page-buttons';
import CalendarEntryPages from './calendar-entry-pages/calendar-entry-pages';
import { sortOptions } from './calendar-helpers';
import Analytics from '../../utils/analytics/analytics';
import { basicFetch } from '../../utils/api-utils';
import LoadingIndicator from '../loading-indicator/loading-indicator';

export const maxEntriesPerPage = 25;
export const releaseCalendarSortEvent = {
  category: 'Release Calendar',
  action: 'Sort By Click',
};
const releaseCalendarUrl = `https://api.fiscaldata.treasury.gov/services/calendar/release`;
const metadataUrl = `https://api.fiscaldata.treasury.gov/services/dtg/metadata/`;

const CalendarEntriesList = () => {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [entries, setEntries] = useState(null);
  const [maxPage, setMaxPage] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [earliestDate, setEarliestDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(sortOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      const getMetaData = async () => {
        return new Promise(resolve => {
          fetch(metadataUrl).then(res => {
            resolve(res.json());
          });
        });
      };
      const data = await getMetaData();
      setMetaData(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (metaData) {
        const res = await basicFetch(releaseCalendarUrl);
        res.forEach((element, index) => {
          const datasetMetaData = metaData.find(d => d.dataset_id === element.datasetId);
          if (datasetMetaData) {
            res[index] = {
              ...element,
              dataset: {
                name: datasetMetaData.title,
                slug: `/${datasetMetaData.dataset_path}/`,
              },
            };
          }
        });
        setApiData(sortByDate(res));
        setEntries(sortByDate(res));
      }
    })();
  }, [metaData]);

  useEffect(() => {
    if (entries) {
      setLoading(false);
      setMaxPage(Math.ceil(entries.length / maxEntriesPerPage));
      setEarliestDate(entries[0].date);
    }
  }, [entries]);

  const sortByName = e => {
    return e.sort((a, b) => {
      const nameSort = a.dataset.name.localeCompare(b.dataset.name);
      if (nameSort !== 0) {
        return nameSort;
      }
      return dateSorter(a, b);
    });
  };

  const sortByDate = e => {
    return e.sort(dateSorter);
  };

  const dateSorter = (a, b) => {
    const aSortValue = `${a.date}-${a.time}`,
      bSortValue = `${b.date}-${b.time}`;
    if (aSortValue > bSortValue) return 1;
    if (aSortValue < bSortValue) return -1;
    return 0;
  };

  const handleSelectedOptionChange = option => {
    setSelectedOption(option);
    setCurrentPage(1);

    if (option.id === 'name') {
      // if entries are sorted by name, only the next release date for each dataset should be shown
      const releasesMap = new Map();

      entries.forEach(r => {
        if (!releasesMap.has(r.datasetId)) {
          releasesMap.set(r.datasetId, r);
        }
      });

      const filteredReleases = [...releasesMap.values()];
      setEntries(sortByName(filteredReleases));
    } else {
      setEntries(apiData);
    }

    Analytics.event({
      ...releaseCalendarSortEvent,
      label: option.label,
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: releaseCalendarSortEvent.action,
      eventLabel: option.label,
    });
  };

  const pagesArray = [];
  for (let i = 1; i <= maxPage; i++) {
    pagesArray.push(i);
  }
  pagesArray.sort((a, b) => a - b);

  const handleJump = page => {
    setCurrentPage(page);
  };

  const pageButtonProps = {
    maxRows: maxEntriesPerPage,
    maxPage,
    pagesArray,
    currentPage,
    handleJump,
  };

  return loading ? (
    <LoadingIndicator loadingClass={loadingIcon} />
  ) : (
    <div className={mainContainer}>
      <div className={dropdownContainer}>
        <div className={releaseCalendarLegend}>
          <span>
            {' '}
            <FontAwesomeIcon icon={faCheckCircle} className={updateStatusIcon} />
            Released
          </span>
          <span className={releaseCalendarLegendGray}>
            <div className={notYetUpdated} />
            Not Released
          </span>
        </div>
        <div className={dropdown}>
          <SelectControl label="Sort By:" options={sortOptions} selectedOption={selectedOption} changeHandler={handleSelectedOptionChange} />
        </div>
      </div>
      <div className={entriesContainer}>
        <CalendarEntryPages
          activePage={currentPage}
          selectedOption={selectedOption}
          entries={entries}
          entriesPerPage={maxEntriesPerPage}
          earliestDate={earliestDate}
        />
      </div>
      <div className={pagination}>
        <PageButtons pageButtonProps={pageButtonProps} />
      </div>
    </div>
  );
};

export default CalendarEntriesList;
