import React, { FunctionComponent, useEffect, useState, useMemo } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import DatePicker from '../../../components/date-picker/date-picker';
import ReportsEmptyTable from '../reports-empty-table/reports-empty-table';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { format } from 'date-fns';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
// import AccountBox from '@mui/icons-material/AccountBox';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { DownloadReportTable } from '../download-report-table/download-report-table';
import { sectionTitle } from '../published-reports';
import { filterContainer } from './filter-report-section.module.scss';
import { useFilterReports, SPECIAL_LABEL } from './filter-reports-section-helpers/useFilterReports';

const FilterReportsSection: FunctionComponent<any> = ({ dataset, width }) => {
  const { runTimeReportConfig: reportConfig, apis } = dataset;

  const { filterOptions, dateOptionsNested, reports, apiError, setApiError, updateAvailableDates, getReports } = useFilterReports(
    dataset,
    reportConfig
  );

  const [selectedOption, setSelectedOption] = useState({ label: '(None selected)', value: '' });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [filterDropdownActive, setFilterDropdownActive] = useState(false);
  const [dateDropdownActive, setDateDropdownActive] = useState(false);
  const [filterSearchBarActive, setSearchBarActive] = useState(false);

  const [earliestDate, setEarliest] = useState<Date | undefined>();
  const [latestDate, setLatest] = useState<Date | undefined>();
  const [allDates, setAllDates] = useState<string[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);

  const {
    filterLabel = 'Account',
    dateFilterLabel = 'Published Date',
    dateFilterType,
    searchText,
    cusipFirst,
    dataTableRequest,
    unmatchedHeader,
    unmatchedMessage,
    defaultHeader,
    defaultMessage,
  } = reportConfig;

  const isSpecial = selectedOption.label === SPECIAL_LABEL;
  const useCusipFirst = Boolean(cusipFirst) && Boolean(dataTableRequest);

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

  useEffect(() => {
    if (useCusipFirst) updateAvailableDates(selectedOption, isSpecial);
  }, [selectedOption, isSpecial, useCusipFirst, updateAvailableDates]);

  useEffect(() => {
    getReports(selectedOption, selectedDate, selectedDateStr, isSpecial);
  }, [selectedOption, selectedDate, selectedDateStr, isSpecial, getReports]);

  const onCusipChange = (opt: any) => {
    setSelectedOption(opt || { label: '(None selected)', value: '' });
    setFilterDropdownActive(false);
    if (useCusipFirst) {
      setSelectedDate(undefined);
      setSelectedDateStr('');
    }
  };

  const onDateChange = (opt: any) => {
    if (opt?.value) {
      setSelectedDateStr(opt.value);
      setSelectedDate(new Date(`${opt.value}T00:00:00`));
      setDateDropdownActive(false);
    }
  };

  const dateSelectedLabel = useMemo(() => {
    const dValue = useCusipFirst ? selectedDateStr : selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    if (!dValue) return '(None selected)';
    return format(new Date(`${dValue}T00:00:00`), dateFilterType === 'byDay' ? 'MMMM d, yyyy' : 'MMMM yyyy');
  }, [useCusipFirst, selectedDateStr, selectedDate, dateFilterType]);

  const accountDropdown = (
    <DropdownContainer
      setActive={setFilterDropdownActive}
      dropdownButton={
        <DropdownLabelButton
          selectedOption={selectedOption.label}
          label={filterLabel}
          active={filterDropdownActive}
          setActive={setFilterDropdownActive}
          muiIcon={<></>}
        />
      }
    >
      <ComboSelectDropdown
        active={filterDropdownActive}
        setDropdownActive={setFilterDropdownActive}
        selectedOption={selectedOption}
        updateSelection={onCusipChange}
        searchBarLabel={searchText || 'Search'}
        options={filterOptions}
        searchBarActive={filterSearchBarActive}
        setSearchBarActive={setSearchBarActive}
      />
    </DropdownContainer>
  );

  const dateSection = useCusipFirst ? (
    <DropdownContainer
      setActive={setDateDropdownActive}
      dropdownButton={
        <DropdownLabelButton
          selectedOption={dateSelectedLabel}
          label={dateFilterLabel}
          active={dateDropdownActive}
          setActive={setDateDropdownActive}
          disabled={!selectedOption.value}
          icon={faCalendar}
          dropdownWidth="20rem"
        />
      }
    >
      <ComboSelectDropdown
        active={dateDropdownActive}
        setDropdownActive={setDateDropdownActive}
        selectedOption={{ label: dateSelectedLabel, value: selectedDateStr }}
        updateSelection={onDateChange}
        disableSearchBar
        options={dateOptionsNested}
        hasChildren
      />
    </DropdownContainer>
  ) : (
    latestDate && (
      <DatePicker
        isDaily={dateFilterType === 'byDay'}
        latestDate={latestDate}
        earliestDate={earliestDate}
        allYears={allYears}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        label={dateFilterLabel}
        allDates={dataTableRequest ? null : allDates}
        ignoreDisabled
      />
    )
  );

  const showTable = reports.length > 0 && !apiError;

  return (
    <DatasetSectionContainer title={sectionTitle} id="reports-and-files">
      <div className={filterContainer}>
        {/* Layout Order Fixed: Date first for standard datasets */}
        {useCusipFirst ? (
          <>
            {accountDropdown} {dateSection}
          </>
        ) : (
          <>
            {dateSection} {accountDropdown}
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
