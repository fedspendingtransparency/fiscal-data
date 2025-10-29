import React, { FunctionComponent, useEffect, useState } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import DatePicker from '../../../components/date-picker/date-picker';
import ReportsEmptyTable from '../reports-empty-table/reports-empty-table';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

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
import { getCache, setCache, makeKey } from './filter-reports-section-helpers/filter-reports-cache';
import { buildNestedDateOptions } from './filter-reports-section-helpers/date-options';

type Props = {
  dataset: {
    runTimeReportConfig: IRunTimeReportConfig;
    apis: IDatasetApi[];
    datasetId: string;
  };
  width?: number;
};

export const defaultSelection = { label: '(None selected)', value: '' };

const FilterReportsSection: FunctionComponent<Props> = ({ dataset, width }) => {
  const { runTimeReportConfig: reportConfig, apis, datasetId } = dataset;

  const [selectedOption, setSelectedOption] = useState<{ label: string; value: string }>(defaultSelection);
  const [filterOptions, setFilterOptions] = useState<Array<{ label: string; value: string }>>([defaultSelection]);
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [filterSearchBarActive, setFilterSearchBarActive] = useState(false);

  const [earliestDate, setEarliest] = useState<Date | undefined>();
  const [latestDate, setLatest] = useState<Date | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [allDates, setAllDates] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [dateDropdownActive, setDateDropdownActive] = useState(false);
  const [dateOptionsNested, setDateOptionsNested] = useState<
    Array<{ label: string; isLabel?: boolean; children?: Array<{ label: string; value: string }> }>
  >([]);

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
    cusipFirst,
  } = reportConfig;

  const reportFields = dataTableRequest?.fields ? dataTableRequest.fields.split(',') : [];

  const isSpecial = !!specialAnnouncement && selectedOption.label === (specialAnnouncement as any).label;
  const useCusipFirst = Boolean(cusipFirst) && Boolean(dataTableRequest);

  useEffect(() => {
    if (!apis?.length) return;
    const e = new Date(Math.min(...apis.map(a => +new Date(a.earliestDate))));
    const l = new Date(Math.max(...apis.map(a => +new Date(a.latestDate))));
    setEarliest(e);
    setLatest(l);
    setSelectedDate(l);
    setAllDates([e.toISOString().slice(0, 7), l.toISOString().slice(0, 7)]);
    const yrs: string[] = [];
    for (let y = e.getFullYear(); y <= l.getFullYear(); y++) yrs.push(String(y));
    setAllYears(yrs);
  }, [apis]);

  useEffect(() => {
    const cacheSeed = async () => {
      const base: Array<{ label: string; value: string }> = [defaultSelection];

      if (specialAnnouncement) {
        base.push((specialAnnouncement as unknown) as { label: string; value: string });
      }

      if (optionValues?.length) {
        optionValues.forEach(v => base.push({ label: v, value: v }));
        setFilterOptions(base);
        return;
      }

      if (!apis?.length || !filterField) {
        setFilterOptions(base);
        return;
      }

      const { endpoint } = apis[0];
      const url =
        `${API_BASE_URL}/services/api/fiscal_service/${endpoint}` +
        `?fields=${encodeURIComponent(filterField)}` +
        `&sort=${encodeURIComponent(filterField)}` +
        `&page[size]=10000`;
      //Get report names from raw data table
      const cacheKey = makeKey('opts', datasetId, endpoint, filterField);
      const cached = getCache<Array<{ label: string; value: string }>>(cacheKey);
      if (cached) {
        setFilterOptions([defaultSelection, ...(specialAnnouncement ? [specialAnnouncement as any] : []), ...cached]);
        return;
      }

      try {
        const res = await basicFetch(url);
        const vals = Array.isArray(res?.data)
          ? Array.from(
              new Set(
                res.data
                  .map((r: any) => r?.[filterField])
                  .filter(Boolean)
                  .map((s: string) => String(s).trim())
              )
            )
          : [];
        const opts = vals.map(v => ({ label: v, value: v }));
        setCache(cacheKey, opts, 1000 * 60 * 60 * 24);
        setFilterOptions([defaultSelection, ...(specialAnnouncement ? [specialAnnouncement as any] : []), ...opts]);
      } catch {
        setFilterOptions(base);
      }
    };
    cacheSeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apis, datasetId, filterField, specialAnnouncement, optionValues]);

  const fetchAvailableDatesForCusip = async (cusipValue: string): Promise<string[]> => {
    const { endpoint } = apis[0];
    const { dateField } = dataTableRequest!;
    const cacheKey = makeKey('dates', datasetId, endpoint, filterField, cusipValue);

    const cached = getCache<string[]>(cacheKey);
    if (cached) return cached;

    const url =
      `${API_BASE_URL}/services/api/fiscal_service/${endpoint}` +
      `?filter=${encodeURIComponent(`${filterField}:eq:${cusipValue}`)}` +
      `&fields=${encodeURIComponent(dateField)}` +
      `&sort=-${encodeURIComponent(dateField)}` +
      `&page[size]=10000`;

    try {
      const res = await basicFetch(url);
      const dates: string[] = Array.isArray(res?.data) ? Array.from(new Set(res.data.map((row: any) => row?.[dateField]).filter(Boolean))) : [];
      setCache(cacheKey, dates, 1000 * 60 * 60);
      return dates;
    } catch {
      return [];
    }
  };

  const fetchAvailableDatesForAnnouncement = async (pathContains: string): Promise<string[]> => {
    const { endpoint } = apis[0] || ({} as any);
    const cacheKey = makeKey('ann_dates', datasetId, endpoint || 'pf', pathContains);

    const cached = getCache<string[]>(cacheKey);
    if (cached) return cached;

    const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}` + `&path_contains=${encodeURIComponent(pathContains)}`;

    try {
      const res = await basicFetch(url);
      const dates = Array.isArray(res) ? Array.from(new Set(res.map((r: any) => r?.report_date).filter(Boolean))) : [];
      setCache(cacheKey, dates, 1000 * 60 * 60);
      return dates;
    } catch {
      return [];
    }
  };

  const fetchPublishedReports = async (fileName: string, date: Date | null = null, firstMatch = false) => {
    const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${fileName}`;
    try {
      return await basicFetch(url).then((res: any[]) => {
        let matchingReports = res;
        if (date) {
          const formatted = format(date, 'yyyy-MM-dd');
          matchingReports = res.filter(r => r.report_date === formatted);
        }
        matchingReports.forEach(r => {
          const d = r.report_date;
          r.report_date = convertDate(d);
        });
        return firstMatch ? matchingReports[0] : matchingReports;
      });
    } catch {
      return null;
    }
  };

  const fetchReportsFromDataTable = async (filterValue: string, dateStr: string) => {
    const { endpoint } = apis[0];
    const { dateField, fields } = dataTableRequest!;
    const filters = `${dateField}:eq:${dateStr},${filterField}:eq:${filterValue}`;
    const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?filter=${filters}&fields=${fields}`;
    try {
      return await basicFetch(url).then((res: any) => {
        const matching = res?.data;
        const all: Array<Promise<any>> = [];
        if (matching?.length > 0) {
          reportFields.forEach(fileKey => {
            const reportName = matching[0][fileKey];
            if (reportName && reportName !== 'null') {
              all.push(fetchPublishedReports('/' + reportName, null, true));
            }
          });
        }
        return all;
      });
    } catch {
      setApiError(true);
      return null;
    }
  };

  const onCusipChange = (option: { label: string; value: string } | null) => {
    const next = option ?? defaultSelection;
    setSelectedOption(next);
    setFilterDropdownActive(false);
    if (useCusipFirst) {
      setSelectedDate(undefined);
      setSelectedDateStr('');
    }
  };

  const onDateChange = (option: { label: string; value: string } | null) => {
    if (option?.value) {
      setSelectedDateStr(option.value);
      setSelectedDate(new Date(`${option.value}T00:00:00`));
      setDateDropdownActive(false);
    }
  };

  useEffect(() => {
    (async () => {
      if (!useCusipFirst) return;

      if (!selectedOption.value) {
        setDateOptionsNested([]);
        return;
      }

      if (isSpecial) {
        const isoDates = await fetchAvailableDatesForAnnouncement((specialAnnouncement as any).value);
        setDateOptionsNested(buildNestedDateOptions(isoDates, dateFilterType === 'byDay'));
        return;
      }

      const isoDates = await fetchAvailableDatesForCusip(selectedOption.value);
      setDateOptionsNested(buildNestedDateOptions(isoDates, dateFilterType === 'byDay'));
    })();
  }, [useCusipFirst, selectedOption?.value, isSpecial, dateFilterType, specialAnnouncement]);
  // Fetch reports
  useEffect(() => {
    (async () => {
      const haveCusip = !!selectedOption.value;
      const haveDate = useCusipFirst ? !!selectedDateStr : !!selectedDate;

      if (!haveCusip || !haveDate) {
        setReports([]);
        setApiError(false);
        return;
      }

      try {
        let allReports: any[] | null = [];

        if (isSpecial) {
          const d = useCusipFirst ? (selectedDateStr ? new Date(`${selectedDateStr}T00:00:00`) : undefined) : selectedDate;
          allReports = await fetchPublishedReports((specialAnnouncement as any).value, d || null);
        } else if (dataTableRequest) {
          const dateStr = useCusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd');
          allReports = await fetchReportsFromDataTable(selectedOption.value, dateStr);
        } else {
          const dateStr = useCusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd');
          const yyyymm = dateStr.replace(/-/g, '').slice(0, 6);
          allReports = await fetchPublishedReports(`${selectedOption.value}${yyyymm}`);
        }

        if (allReports) {
          Promise.all(allReports).then(setReports);
        } else {
          setReports([]);
        }
        setApiError(!allReports || allReports.length === 0);
      } catch {
        setApiError(true);
        setReports([]);
      }
    })();
  }, [useCusipFirst, selectedOption, selectedDate, selectedDateStr, isSpecial, dataTableRequest, specialAnnouncement]);

  const accountDropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedOption?.label}
      label={filterLabel}
      active={filterDropdownActive}
      setActive={setFilterDropdownActive}
      muiIcon={<AccountBox />}
    />
  );

  const dateSelectedLabel = (useCusipFirst
  ? selectedDateStr
  : selectedDate)
    ? dateFilterType === 'byDay'
      ? format(new Date(`${useCusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd')}T00:00:00`), 'MMMM d, yyyy')
      : format(new Date(`${useCusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd')}T00:00:00`), 'MMMM yyyy')
    : '(None selected)';

  const dateDropdownButton = (
    <DropdownLabelButton
      selectedOption={dateSelectedLabel}
      label={dateFilterLabel || 'Published Date'}
      active={dateDropdownActive}
      setActive={setDateDropdownActive}
      dropdownWidth="20rem"
      disabled={useCusipFirst && !selectedOption.value}
      icon={faCalendar}
    />
  );

  const showTable = reports.length > 0 && !apiError;

  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      <div className={filterContainer}>
        {useCusipFirst ? (
          <>
            <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={accountDropdownButton}>
              <ComboSelectDropdown
                active={filterDropdownActive}
                setDropdownActive={setFilterDropdownActive}
                selectedOption={selectedOption}
                updateSelection={onCusipChange}
                searchBarLabel={searchText || 'Search CUSIP'}
                options={filterOptions}
                searchBarActive={filterSearchBarActive}
                setSearchBarActive={setFilterSearchBarActive}
              />
            </DropdownContainer>

            <DropdownContainer setActive={setDateDropdownActive} dropdownButton={dateDropdownButton}>
              <ComboSelectDropdown
                active={dateDropdownActive}
                setDropdownActive={setDateDropdownActive}
                selectedOption={
                  (useCusipFirst
                  ? selectedDateStr
                  : selectedDate)
                    ? {
                        label: dateSelectedLabel,
                        value: useCusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd'),
                      }
                    : defaultSelection
                }
                updateSelection={onDateChange}
                disableSearchBar
                options={dateOptionsNested}
                hasChildren
              />
            </DropdownContainer>
          </>
        ) : (
          <>
            {latestDate && (
              <DatePicker
                isDaily={dateFilterType === 'byDay'}
                latestDate={latestDate}
                earliestDate={earliestDate}
                allDates={dataTableRequest ? null : allDates}
                allYears={allYears}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                label={dateFilterLabel || 'Published Date'}
                ariaLabel={dateFilterType === 'byDay' ? 'Select a date' : 'Select month/year'}
                ignoreDisabled
              />
            )}
            <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={accountDropdownButton}>
              <ComboSelectDropdown
                active={filterDropdownActive}
                setDropdownActive={setFilterDropdownActive}
                selectedOption={selectedOption}
                updateSelection={onCusipChange}
                searchBarLabel={searchText || 'Search accounts'}
                options={filterOptions}
                searchBarActive={filterSearchBarActive}
                setSearchBarActive={setFilterSearchBarActive}
              />
            </DropdownContainer>
          </>
        )}
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
