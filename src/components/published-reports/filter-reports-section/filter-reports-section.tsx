import React, { useEffect, useState } from 'react';
import { withWindowSize } from 'react-fns';
import DatasetSectionContainer from '../../dataset-section-container/dataset-section-container';
import DatePicker from '../../../components/date-picker/date-picker';
import ReportsEmptyTable from '../reports-empty-table/reports-empty-table';

import { IRunTimeReportConfig } from '../../../models/IRunTimeReportConfig';
import { IDatasetApi } from '../../../models/IDatasetApi';
import { sectionTitle } from '../published-reports';
import { filterContainer } from './filter-report-section.module.scss';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import AccountBox from '@material-ui/icons/AccountBox';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { DownloadReportTable } from '../download-report-table/download-report-table';

type Props = {
  reportConfig: IRunTimeReportConfig;
  apis: IDatasetApi[];
};
export const defaultSelection = { label: '(None selected)', value: '' };

const FilterReportsSection: React.FC<Props> = ({ reportConfig, apis, width }) => {
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

  // TODO: Re-add when filters are applied to the table
  // useEffect(() => {
  //   (async () => {
  //     if (!selectedOption.value || !selectedDate) {
  //       setReports([]);
  //       return;
  //     }
  //     try {
  //       const data = await Promise.all(
  //         apis.map(async api => {
  //           const url = `${apiPrefix}${buildEndpoint(selectedDate, api.dateField, selectedOption.value, reportConfig.filterField, api)}`;
  //           const res = await basicFetch(url);
  //           return {
  //             id: api.apiId,
  //             name: `${api.tableName}-${selectedOption.label}.pdf`,
  //             date: format(selectedDate, 'MMMM yyyy'),
  //             size: `${(res.data.length / 1024).toFixed(1)} KB`,
  //             data: res.data,
  //             colConfig: api,
  //           };
  //         })
  //       );
  //       setReports(data.filter(r => r.data.length));
  //       setApiError(false);
  //     } catch {
  //       setApiError(true);
  //       setReports([]);
  //     }
  //   })();
  // }, [selectedAccount, selectedDate, apis, reportConfig.filterField]);

  useEffect(() => {
    const allOptions = [defaultSelection];
    reportConfig.optionValues?.forEach(option => {
      allOptions.push({ label: option, value: option });
    });
    setFilterOptions(allOptions);
  }, []);

  const showTable = reports.length > 0 && !apiError;

  const dropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedOption?.label}
      label="Account"
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
            isDaily={false}
            latestDate={latestDate}
            earliestDate={earliestDate}
            allDates={allDates}
            allYears={allYears}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            ignoreDisabled
            ariaLabel="Select month/year"
          />
        )}
        <DropdownContainer setActive={setFilterDropdownActive} dropdownButton={dropdownButton}>
          <ComboSelectDropdown
            active={filterDropdownActive}
            setDropdownActive={setFilterDropdownActive}
            selectedOption={selectedOption}
            updateSelection={onFilterChange}
            searchBarLabel={reportConfig.searchText || 'Search accounts'}
            options={filterOptions}
            searchBarActive={filterSearchBarActive}
            setSearchBarActive={setFilterSearchBarActive}
          />
        </DropdownContainer>
      </div>
      {!showTable && (
        <ReportsEmptyTable
          width={width}
          heading={apiError ? reportConfig.unmatchedHeader : reportConfig.defaultHeader}
          body={apiError ? reportConfig.unmatchedMessage : reportConfig.defaultMessage}
          apiErrorMessage={apiError}
        />
      )}
      {showTable && <DownloadReportTable isDailyReport={false} generatedReports={reports} setApiErrorMessage={setApiError} width={width} />}
    </DatasetSectionContainer>
  );
};

export default withWindowSize(FilterReportsSection);
