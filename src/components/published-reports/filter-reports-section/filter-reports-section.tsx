import React, { FunctionComponent, useEffect, useState, useRef } from 'react';
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
import AccountBox from '@mui/icons-material/AccountBox';
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
const RUNTIME_OPTIONS_CACHE_VERSION = 'v2-all-cusips';
type Option = { label: string; value: string };

const FilterReportsSection: FunctionComponent<Props & { width?: number }> = ({ dataset, width }) => {
  const { runTimeReportConfig: reportConfig, apis, datasetId } = dataset;
  const [selectedOption, setSelectedOption] = useState<Option>(defaultSelection);
  const [earliestDate, setEarliest] = useState<Date>();
  const [latestDate, setLatest] = useState<Date>();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [filterOptions, setFilterOptions] = useState<Option[]>([defaultSelection]);
  const [allDates, setAllDates] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [filterSearchBarActive, setFilterSearchBarActive] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [apiError, setApiError] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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

  const fetchReportsFromDataTable = async (filterValue: string, date: Date) => {
    const { endpoint } = apis[0];
    const { dateField, fields } = dataTableRequest!;
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
          reportFields?.forEach((file: string) => {
            const reportName = matchingReports[0][file];
            if (reportName && reportName !== 'null') {
              const curReport = fetchPublishedReports('/' + reportName, null, true);
              allReports.push(curReport);
            }
          });
        }
        return allReports;
      });
    } catch {
      setApiError(true);
      return null;
    }
  };

  const fetchPublishedReports = async (fileName: string, date: Date | null = null, firstMatch = false) => {
    const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${fileName}`;
    try {
      return await basicFetch(url).then((res: any[]) => {
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
    } catch {
      return null;
    }
  };

  const cacheKeyAll = `runtime-options:${RUNTIME_OPTIONS_CACHE_VERSION}:${datasetId}:${filterField}:ALL`;

  const readCachedAll = (): Option[] | null => {
    try {
      const raw = sessionStorage.getItem(cacheKeyAll);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  };

  const writeCachedAll = (opts: Option[]) => {
    try {
      sessionStorage.setItem(cacheKeyAll, JSON.stringify(opts));
    } catch {}
  };

  const fetchAllOptions = async (): Promise<Option[]> => {
    if (!apis?.length || !filterField) return [defaultSelection];

    const { endpoint } = apis[0];
    const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?fields=${filterField}&page[size]=5000`;

    try {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await basicFetch(url, { signal: controller.signal } as any);
      const rows: any[] = res?.data || [];

      const uniq = Array.from(new Set(rows.map(r => (r?.[filterField] ?? '').toString().trim()).filter(Boolean)));
      uniq.sort();

      const base: Option[] = [defaultSelection];
      if (specialAnnouncement) base.push(specialAnnouncement);
      const runtime = uniq.map(v => ({ label: v, value: v }));
      const finalOpts = [...base, ...runtime];

      writeCachedAll(finalOpts);
      return finalOpts;
    } catch {
      const base: Option[] = [defaultSelection];
      if (specialAnnouncement) base.push(specialAnnouncement);
      const seeds = optionValues?.map((o: string) => ({ label: o, value: o })) || [];
      return [...base, ...seeds];
    } finally {
      setOptionsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      setOptionsLoading(true);
      const cached = readCachedAll();
      if (cached?.length) {
        setFilterOptions(cached);
        setOptionsLoading(false);
        return;
      }

      const seed: Option[] = [defaultSelection];
      if (specialAnnouncement) seed.push(specialAnnouncement);
      optionValues?.forEach((opt: string) => seed.push({ label: opt, value: opt }));
      if (seed.length > 1) setFilterOptions(seed);

      const fresh = await fetchAllOptions();
      setFilterOptions(fresh);
      // if current selection not in new list, reset
      const exists = fresh.some(o => o.value === selectedOption.value);
      if (!exists) setSelectedOption(defaultSelection);
    };
    init();
  }, [apis, filterField, datasetId]);

  useEffect(() => {
    (async () => {
      if (!selectedOption.value || !selectedDate) {
        setReports([]);
        setApiError(false);
        return;
      }
      try {
        let allReports: any[] | null = [];
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
        setApiError((allReports?.length || 0) === 0);
      } catch {
        setApiError(true);
        setReports([]);
      }
    })();
  }, [selectedOption, selectedDate, apis, filterField, specialAnnouncement, dataTableRequest]);

  const showTable = reports.length > 0 && !apiError;

  const dropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedOption?.label}
      label={filterLabel}
      active={filterDropdownActive}
      setActive={setFilterDropdownActive}
      muiIcon={<AccountBox />}
      badgeText={optionsLoading ? '...' : undefined}
    />
  );

  const onFilterChange = (option: Option | null) => {
    if (option !== null) {
      setSelectedOption(option);
      setTimeout(() => setFilterDropdownActive(false));
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
