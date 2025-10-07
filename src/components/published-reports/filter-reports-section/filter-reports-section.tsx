import React, { FunctionComponent, useEffect, useState } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import DatePicker from '../../../components/date-picker/date-picker';
import ReportsEmptyTable from '../reports-empty-table/reports-empty-table';

import { API_BASE_URL } from 'gatsby-env-variables';
import { IRunTimeReportConfig } from '../../../models/IRunTimeReportConfig';
import { IDatasetApi } from '../../../models/IDatasetApi';
import { sectionTitle } from '../published-reports';
import { filterContainer } from './filter-report-section.module.scss';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import AccountBox from '@material-ui/icons/AccountBox';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { DownloadReportTable } from '../download-report-table/download-report-table';
import { basicFetch } from '../../../utils/api-utils';
import { format } from 'date-fns';
import { convertDate } from '../../dataset-data/dataset-data-helper/dataset-data-helper';

type Props = {
  dataset: {
    runTimeReportConfig: IRunTimeReportConfig;
    apis: IDatasetApi[];
    datasetId: string;
  };
};

export const defaultSelection = { label: '(None selected)', value: '' };

const FilterReportsSection: FunctionComponent<Props> = ({ dataset, width }) => {
  const { runTimeReportConfig: reportConfig, apis, datasetId } = dataset;
  const [selectedOption, setSelectedOption] = useState(defaultSelection);
  const [earliestDate, setEarliest] = useState<Date>();
  const [latestDate, setLatest] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterOptions, setFilterOptions] = useState([defaultSelection]);
  const [allDates, setAllDates] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [filterSearchBarActive, setFilterSearchBarActive] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [apiError, setApiError] = useState(false);
  const {
    filterLabel = 'Account',
    dateFilterLabel = 'Published Date',
    dateFilterType,
    searchText,
    filterField,
    optionValues,
    unmatchedMessage,
    unmatchedHeader,
    defaultMessage,
    defaultHeader,
    specialAnnouncement,
    dataTableRequest,
  } = reportConfig;
  const reportFields = dataTableRequest?.fields && dataTableRequest.fields.split(',');

  useEffect(() => {
    if (!apis?.length) return;
    const e = new Date(Math.min(...apis.map(a => +new Date(a.earliestDate))));
    const l = new Date(Math.max(...apis.map(a => +new Date(a.latestDate))));
    setEarliest(e);
    setLatest(l);
    setSelectedDate(l);
    setAllDates([e.toISOString().slice(0, 7), l.toISOString().slice(0, 7)]);
    const yrs = [];
    for (let y = e.getFullYear(); y <= l.getFullYear(); y++) yrs.push(String(y));
    setAllYears(yrs);
  }, [apis]);

  const fetchReportsFromDataTable = async (filterValue, date) => {
    const { endpoint } = apis[0];
    const { dateField, fields } = dataTableRequest;
    const formattedDate = format(date, 'yyyy-MM-dd');
    const filters = `${dateField}:eq:${formattedDate},${filterField}:eq:${filterValue}`;
    const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?filter=${filters}&fields=${fields}`;
    //Get report names from raw data table
    try {
      return await basicFetch(url).then(res => {
        const matchingReports = res.data;
        const allReports = [];
        if (matchingReports?.length > 0) {
          //Then get all matching reports from published report api
          reportFields.map(async file => {
            const reportName = matchingReports[0][file];
            if (reportName && reportName !== 'null') {
              const curReport = fetchPublishedReports('/' + reportName, null, true);
              allReports.push(curReport);
            }
          });
        }
        return allReports;
      });
    } catch (e) {
      setApiError(true);
      return null;
    }
  };

  const fetchPublishedReports = async (fileName, date = null, firstMatch = false) => {
    const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${fileName}`;
    try {
      return await basicFetch(url).then(res => {
        let matchingReports = res;
        if (date) {
          const formattedDate = format(date, 'yyyy-MM-dd');
          matchingReports = res.filter(report => report.report_date === formattedDate);
        }
        matchingReports.forEach(report => {
          const date = report.report_date;
          report.report_date = convertDate(date);
        });
        return firstMatch ? matchingReports[0] : matchingReports;
      });
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      if (!selectedOption.value || !selectedDate) {
        setReports([]);
        setApiError(false);
        return;
      }
      try {
        let allReports = [];
        if (specialAnnouncement && selectedOption.label === specialAnnouncement.label) {
          allReports = await fetchPublishedReports(specialAnnouncement.value, selectedDate);
        } else if (dataTableRequest) {
          allReports = await fetchReportsFromDataTable(selectedOption.value, selectedDate);
        } else {
          // get all reports from published report api (fip)
          const formattedDate = format(selectedDate, 'yyyyMM');
          allReports = await fetchPublishedReports(`${selectedOption.value}${formattedDate}`);
        }
        if (allReports) {
          Promise.all(allReports).then(reports => setReports(reports));
        } else {
          setReports([]);
        }
        setApiError(allReports.length === 0);
      } catch {
        setApiError(true);
        setReports([]);
      }
    })();
  }, [selectedOption, selectedDate, apis, filterField]);

  useEffect(() => {
    const allOptions = [defaultSelection];
    if (specialAnnouncement) {
      allOptions.push(specialAnnouncement);
    }
    optionValues?.forEach(option => {
      allOptions.push({ label: option, value: option });
    });
    setFilterOptions(allOptions);
  }, []);

  const showTable = reports.length > 0 && !apiError;

  const dropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedOption?.label}
      label={filterLabel}
      active={filterDropdownActive}
      setActive={setFilterDropdownActive}
      muiIcon={<AccountBox />}
    />
  );

  const onFilterChange = option => {
    if (option !== null) {
      setSelectedOption(option);
      setTimeout(() => {
        setFilterDropdownActive(false);
      });
    }
  };

  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      <div className={filterContainer}>
        {latestDate && (
          <DatePicker
            isDaily={dateFilterType === 'byDay'}
            latestDate={latestDate}
            earliestDate={earliestDate}
            allDates={dataTableRequest ? null : allDates}
            allYears={allYears}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            ignoreDisabled
            label={dateFilterLabel || 'Published Date'}
            ariaLabel={dateFilterType === 'byDay' ? 'Select a date' : 'Select month/year'}
          />
        )}
        <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={dropdownButton}>
          <ComboSelectDropdown
            active={filterDropdownActive}
            setDropdownActive={setFilterDropdownActive}
            selectedOption={selectedOption}
            updateSelection={onFilterChange}
            searchBarLabel={searchText || 'Search accounts'}
            options={filterOptions}
            searchBarActive={filterSearchBarActive}
            setSearchBarActive={setFilterSearchBarActive}
          />
        </DropdownContainer>
      </div>
      {!showTable && (
        <ReportsEmptyTable width={width} heading={apiError ? unmatchedHeader : defaultHeader} body={apiError ? unmatchedMessage : defaultMessage} />
      )}
      {showTable && (
        <DownloadReportTable isDailyReport={dateFilterType === 'byDay'} reports={reports} setApiErrorMessage={setApiError} width={width} />
      )}
    </DatasetSectionContainer>
  );
};

export default withWindowSize(FilterReportsSection);
