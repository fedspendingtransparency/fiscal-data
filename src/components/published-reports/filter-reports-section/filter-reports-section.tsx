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

  // CUSIP/Filter selection
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
    const allOptions: Array<{ label: string; value: string }> = [defaultSelection];
    if (specialAnnouncement) {
      allOptions.push((specialAnnouncement as unknown) as { label: string; value: string });
    }
    optionValues?.forEach(opt => allOptions.push({ label: opt, value: opt }));
    setFilterOptions(allOptions);
  }, [optionValues, specialAnnouncement]);

  const buildNestedDateOptions = (isoDates: string[]) => {
    const groups: Record<string, { label: string; children: Array<{ label: string; value: string }> }> = {};
    isoDates.forEach(iso => {
      const d = new Date(`${iso}T00:00:00`);
      const year = String(d.getFullYear());
      const childLabel = dateFilterType === 'byDay' ? format(d, 'MMM d, yyyy') : format(d, 'MMMM yyyy');
      if (!groups[year]) groups[year] = { label: year, children: [] };
      if (!groups[year].children.some(c => c.value === iso)) {
        groups[year].children.push({ label: childLabel, value: iso });
      }
    });

    return Object.values(groups)
      .sort((a, b) => Number(b.label) - Number(a.label))
      .map(group => ({
        label: group.label,
        isLabel: true,
        children: group.children.sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime()),
      }));
  };

  const fetchAvailableDatesForCusip = async (cusipValue: string): Promise<string[]> => {
    const { endpoint } = apis[0];
    const { dateField } = dataTableRequest!;
    //Get report names from raw data table
    const url =
      `${API_BASE_URL}/services/api/fiscal_service/${endpoint}` +
      `?filter=${filterField}:eq:${cusipValue}` +
      `&fields=${dateField}` +
      `&sort=-${dateField}` +
      `&page[size]=10000`;
    try {
      const res = await basicFetch(url);
      //Then get all matching reports from published report api
      const dates: string[] = Array.isArray(res?.data) ? Array.from(new Set(res.data.map(report => report[dateField]).filter(Boolean))) : [];
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
    if (cusipFirst) {
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
      if (!cusipFirst) return;
      if (!selectedOption.value) {
        setDateOptionsNested([]);
        return;
      }
      const isoDates = dataTableRequest ? await fetchAvailableDatesForCusip(selectedOption.value) : [];
      setDateOptionsNested(buildNestedDateOptions(isoDates));
    })();
  }, [selectedOption?.value, cusipFirst]);

  useEffect(() => {
    (async () => {
      const haveCusip = !!selectedOption.value;
      const haveDate = cusipFirst ? !!selectedDateStr : !!selectedDate;

      if (!haveCusip || !haveDate) {
        setReports([]);
        setApiError(false);
        return;
      }

      try {
        let allReports: any = [];
        if (specialAnnouncement && selectedOption.label === (specialAnnouncement as any).label) {
          const d = selectedDate ?? (selectedDateStr ? new Date(`${selectedDateStr}T00:00:00`) : undefined);
          allReports = await fetchPublishedReports((specialAnnouncement as any).value, d);
        } else if (dataTableRequest) {
          const dateStr = cusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd');
          allReports = await fetchReportsFromDataTable(selectedOption.value, dateStr);
        } else {
          const dateStr = cusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd');
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
  }, [selectedOption, selectedDate, selectedDateStr, apis, filterField, cusipFirst]);

  const cusipDropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedOption?.label}
      label={filterLabel}
      active={filterDropdownActive}
      setActive={setFilterDropdownActive}
      muiIcon={<AccountBox />}
    />
  );

  const dateSelectedLabel = (cusipFirst
  ? selectedDateStr
  : selectedDate)
    ? dateFilterType === 'byDay'
      ? format(new Date(`${cusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd')}T00:00:00`), 'MMM d, yyyy')
      : format(new Date(`${cusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd')}T00:00:00`), 'MMMM yyyy')
    : '(None selected)';

  const dateDropdownButton = (
    <DropdownLabelButton
      selectedOption={dateSelectedLabel}
      label={dateFilterLabel || 'Published Date'}
      active={dateDropdownActive}
      setActive={setDateDropdownActive}
      dropdownWidth="20rem"
      disabled={!!cusipFirst && !selectedOption.value}
      icon={faCalendar}
    />
  );

  const showTable = reports.length > 0 && !apiError;

  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      <div className={filterContainer}>
        {cusipFirst ? (
          <>
            <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={cusipDropdownButton}>
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
                  (cusipFirst
                  ? selectedDateStr
                  : selectedDate)
                    ? {
                        label: dateSelectedLabel,
                        value: cusipFirst ? selectedDateStr : format(selectedDate as Date, 'yyyy-MM-dd'),
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
            <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={cusipDropdownButton}>
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
