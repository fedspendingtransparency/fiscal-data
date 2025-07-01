import React, { FunctionComponent, useEffect, useState } from 'react';
import { filterContainer, monthYearContainer, selectorContainer } from './month-year-filter.module.scss';
import { monthFullNames } from '../../../../../../utils/api-utils';
import DropdownLabelButton from '../../../../../dropdown-label-button/dropdown-label-button';
import DropdownContainer from '../../../../../dropdown-container/dropdown-container';
import DataPreviewDropdownDialogSearch from '../../../../data-preview-dropdown-search/data-preview-dropdown-dialog-search';

const generateYearOptions = (earliestDate: Date, latestDate: Date) => {
  const startYear = new Date(earliestDate).getFullYear();
  const endYear = new Date(latestDate).getFullYear();
  const yearOptions = [];

  for (let year = endYear; year >= startYear; year--) {
    yearOptions.push({ label: year, value: year });
  }

  return yearOptions;
};

const generateMonthOptions = () =>
  monthFullNames.map((month, index) => ({
    label: month,
    value: index + 1,
  }));

type MonthYearFilterProps = {
  selectedTable?: {
    earliestDate: Date;
    latestDate: Date;
    apiFilter?: {
      label: string;
      field: string;
      labelField?: string;
      notice: string;
      optionValues: { key: string };
      optionLabels?: { key: string };
      dataUnmatchedMessage: string;
      dataSearchLabel: string;
      fieldFilter?: {
        value: string[];
        field: string;
      };
      futureDated: boolean;
    };
  };
  sharedApiFilterOptions?: boolean;
  setDateRange: (range: { from: Date; to: Date }) => void;
};

const MonthYearFilter: FunctionComponent<MonthYearFilterProps> = ({ selectedTable, setDateRange, sharedApiFilterOptions }) => {
  const defaultMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState({ value: defaultMonth + 1, label: monthFullNames[defaultMonth] });
  const defaultYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState({ value: defaultYear, label: defaultYear });
  const [years, setYears] = useState<{ label: number; value: number }[]>();
  const [months, setMonths] = useState<{ label: string; value: number }[]>();

  const [monthsActive, setMonthsActive] = useState(false);
  const [yearsActive, setYearsActive] = useState(false);

  useEffect(() => {
    setMonths(generateMonthOptions());
  }, []);

  useEffect(() => {
    setYears(generateYearOptions(selectedTable?.earliestDate, selectedTable?.latestDate));
    if (!sharedApiFilterOptions) {
      const startDate = new Date(defaultYear, defaultMonth, 1);
      const endDate = new Date(defaultYear, defaultMonth + 1, 0);
      setSelectedMonth({ value: selectedTable?.apiFilter?.futureDated ? defaultMonth + 2 : defaultMonth + 1, label: monthFullNames[defaultMonth] });
      setSelectedYear({ value: defaultYear, label: defaultYear });
      setDateRange({ from: startDate, to: endDate });
    }
  }, [selectedTable]);

  useEffect(() => {
    const startDate = new Date(selectedYear.value, selectedMonth.value - 1, 1);
    const endDate = new Date(selectedYear.value, selectedMonth.value, 0);
    setDateRange({ from: startDate, to: endDate });
  }, [selectedMonth, selectedYear]);

  const updateYear = (selection: { label: number; value: number }) => {
    if (selection !== null) {
      setSelectedYear(selection);
    }
  };
  const updateMonth = (selection: { label: string; value: number }) => {
    if (selection !== null) {
      setSelectedMonth(selection);
    }
  };

  const monthsButton = <DropdownLabelButton label="Month" selectedOption={selectedMonth.label} active={monthsActive} setActive={setMonthsActive} />;
  const yearsButton = (
    <DropdownLabelButton label="Year" selectedOption={selectedYear.label.toString()} active={yearsActive} setActive={setYearsActive} />
  );

  return (
    <>
      {years && months && (
        <div className={monthYearContainer}>
          <div className={selectorContainer}>
            <div className={filterContainer}>
              <DropdownContainer dropdownButton={monthsButton} setActive={setMonthsActive} active={monthsActive}>
                {monthsActive && (
                  <DataPreviewDropdownDialogSearch
                    options={months}
                    searchBarLabel="Search months"
                    selectedOption={selectedMonth}
                    setSelectedOption={setSelectedMonth}
                    optionLabelKey="label"
                  />
                )}
              </DropdownContainer>
              <DropdownContainer dropdownButton={yearsButton} setActive={setYearsActive} active={yearsActive}>
                {yearsActive && (
                  <DataPreviewDropdownDialogSearch
                    options={years}
                    searchBarLabel="Search years"
                    selectedOption={selectedYear}
                    setSelectedOption={setSelectedYear}
                    optionLabelKey="label"
                  />
                )}
              </DropdownContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MonthYearFilter;
