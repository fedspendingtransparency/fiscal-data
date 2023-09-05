import React, { useEffect, useState, useRef } from 'react';
import {
  filterHeader,
  filterContainer,
  selectWrapper,
  extraMarginBottom,
  hiddenFilters,
  publishReportTip,
  infoIcon,
  iconContainer,
  dailyReport
} from './filter-section.module.scss';
import SelectControl from '../../select-control/select-control';
import { getYearReportOptions, getMonthOptions, getDayOptions } from '../util/util';
import CurrentReportToggle from '../../dataset-data/current-report-toggle/current-report-toggle';
import { getLatestReport } from '../../../helpers/dataset-detail/report-helpers';
import ComboSelect from '../../combo-select/combo-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import ComboCurrencySelect from '../../combo-select/combo-currency-select/combo-currency-select';

export const FilterSection = ({ reports, setSelectedFile, reportsTip }) => {
  const [reportsByYear, setReportsByYear] = useState(getYearReportOptions(reports));
  const [reportsByMonth, setReportsByMonth] = useState([]);
  const [reportsByDay, setReportsByDay] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [filtered, setFiltered] = useState(reports);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredReport, setFilteredReport] = useState(null);
  const [reportGroups, setReportGroups] = useState({});
  const [selectedReportGroup, setSelectedReportGroup] = useState();
  const [currentReport, setCurrentReport] = useState();

  const previousSelectedGroupId = useRef();
  const currentlySelectedGroupIndex = useRef(0);

  const label =
      <span data-testid="yearLabel">
        Year <span className="required">*</span>
      </span>;
  const monthLabel =
      <span data-testid="monthLabel">
        Month <span className="required">*</span>
      </span>;
  const dayLabel =
    <span data-testid="dayLabel">
        Day <span className="required">*</span>
    </span>;

  const populateYears = (reportVal) => {
    const availableYears = getYearReportOptions(reportVal);
    setReportsByYear(availableYears);
    return availableYears;
  };

  const populateDays = () => {
    if (selectedReportGroup?.value && selectedYear?.value && selectedMonth?.value !== null) {
      const filteredReports = selectedReportGroup.value
        .filter(r => r.report_date.getFullYear() === selectedYear.value &&
          (r.report_date.getMonth()) === selectedMonth?.value);
      const availableDays = getDayOptions(filteredReports);
      setReportsByDay(availableDays);

      return {
        filteredReports,
        availableDays
      };
    }
  };

  const populateMonths = () => {
    const filteredReports = selectedReportGroup.value
      .filter(r => r.report_date.getFullYear() === selectedYear.value);
    const availableMonths = getMonthOptions(filteredReports);
    setReportsByMonth(availableMonths);

    return {
      filteredReports,
      availableMonths
    };
  };

  const handleYearSelection = (selectedYear) => {
    if (selectedReportGroup) {
      if (selectedYear && selectedYear.value) {
        const {filteredReports} = populateMonths();
        setFiltered(filteredReports);
      } else {
        setFiltered(selectedReportGroup.value);
        setReportsByMonth([]);
        if (selectedReportGroup.daily) {
          setReportsByDay([]);
        }
      }
    }
  };

  const setFileSelection = (reportFile) => {
    if (reportFile?.report_date && selectedReportGroup?.daily) {
      reportFile.daily = true;
    }
    setSelectedFile(reportFile);
  }

  const toggleCurrentReport = (currentReportSelection) => {
    if (currentReportSelection === false) {
      setShowFilters(true);
      return;
    }
    setCurrentReport(currentReportSelection);
    setFileSelection(currentReportSelection ? currentReportSelection : filteredReport);
    setShowFilters(!currentReportSelection);
  };

  const makeReportGroups = (reports) => {
    const tempObj = {};
    reports.filter(rep => rep.report_group_id !== undefined && Number(rep.report_group_id) > -1)
      .forEach((report) => {
      if (!tempObj[report.report_group_desc]) {
        tempObj[report.report_group_desc] = [];
      }
      tempObj[report.report_group_desc].push(report);
    });
    const groups = [];
    Object.entries(tempObj).forEach(([key, val]) => {
      groups.push({
        label: key,
        id: val[0].report_group_id,
        value: val,
        sortOrderNumber: val[0].report_group_sort_order_nbr,
        daily: isReportGroupDailyFrequency(val)
      })
    });
    return groups.sort((a, b) => {return a.sortOrderNumber - b.sortOrderNumber});
  };

  // assumes reports are sorted for date and check to see whether any month has more than one report
  const isReportGroupDailyFrequency = reports => {
    let yearRepresented = 0;
    let monthRepresented = 0;

    let isDaily = false;
    for (let i = 0; i < reports.length; i++ ) {
      const reportYear = reports[i].report_date.getFullYear();
      const reportMonth = reports[i].report_date.getMonth();
      if (yearRepresented === reportYear && monthRepresented === reportMonth) {
        isDaily = true;
        break;
      } else {
        yearRepresented = reportYear;
        monthRepresented = reportMonth;
      }
    }
    return isDaily;
  };

  const getFileForSelectedMonth = () => {
    if (selectedMonth && typeof selectedMonth.value !== 'undefined') {
      const filteredReports = selectedReportGroup.value
          .filter(r => r.report_date.getFullYear() === selectedYear.value
              && r.report_date.getMonth() === selectedMonth.value);
      setFiltered(filteredReports)
    } else {
      handleYearSelection(selectedYear);
    }
  };

  const getFileForSelectedDay = () => {
    if (selectedDay && selectedDay.value !== null) {
      setFiltered([selectedDay.value]);
    } else {
      getFileForSelectedMonth();
    }
  };

  /*
   * This function is called when switching report groups. We need to repopulate the years and
   * months in the dropdowns and assess if we can use the same selected year/month with the
   *  newest selected report group.
   */
  const recalibrateYMD = (reportVal) => {
    const availableYears = populateYears(reportVal);
    const selectedYearValue = selectedYear ? selectedYear.value : null;
    const selectedMonthValue = selectedMonth ? selectedMonth.value : null;
    const selectedDayValue = selectedDay ? selectedDay.value : null;
    let isSelectedYearValid = false;
    let isSelectedMonthValid = false;
    let isSelectedDayValid = false;

    // Check to see if a year is selected in the dropdown
    if (selectedYearValue) {
      isSelectedYearValid = availableYears.some(r => r.value === selectedYearValue);

      // Is the selected year matches a year in the new report group
      if (isSelectedYearValid) {
        // Populate the available months in the dropdown
        const {availableMonths} = populateMonths(selectedYearValue);

        if (selectedMonthValue) {
          // Check to see if the selected month matches an available month in the new report group
          isSelectedMonthValid = availableMonths.some(r => r.value === selectedMonthValue);

          if (isSelectedMonthValid && selectedReportGroup.daily) {
            const availableDays = populateDays();
            isSelectedDayValid = availableDays?.length &&
              availableDays.some(r => r.value === selectedDayValue);
          }
        }
      }
    }
    if (!isSelectedYearValid) {
      setSelectedYear(null);
    }
    if (!isSelectedMonthValid) {
      setSelectedMonth(null);
    }
    if (!isSelectedDayValid) {
      setSelectedDay(null);
    }
  };

  const smartLoadFile = (newSelectedGroup, _resetIfNoMatch) => {

    if ((!selectedReportGroup?.daily) && selectedYear && selectedMonth && showFilters) {
      getFileForSelectedMonth();
    } else if (selectedReportGroup?.daily && selectedYear &&
      selectedMonth && selectedDay && showFilters) {
      getFileForSelectedDay();
    } else {

      if (selectedReportGroup && (!showFilters || newSelectedGroup)) {
        if (newSelectedGroup) {
          const latestReportInNewlySelectedGroup = getLatestReport(selectedReportGroup.value);
          toggleCurrentReport(latestReportInNewlySelectedGroup);
        } else {
          setFileSelection(currentReport);
        }

      } else if (_resetIfNoMatch){
        setFileSelection(null);
      }
    }
  };

  const changeHandler = (updatedReport) => {
    if (updatedReport !== null) {
      setSelectedReportGroup(updatedReport);
    }
  }

  useEffect(() => {
    // called on page initialization and when reports updates
    if (reportGroups[currentlySelectedGroupIndex.current]) {
      setSelectedReportGroup(reportGroups[currentlySelectedGroupIndex.current]);
      if (!currentReport) {
        const latestReport = getLatestReport(reportGroups[currentlySelectedGroupIndex.current].value);
        setCurrentReport(latestReport);
        setFileSelection(latestReport);
      }
      setReportsByYear(getYearReportOptions(reportGroups[currentlySelectedGroupIndex.current].value));
    }
  }, [reportGroups]);

  useEffect(() => {
    setReportGroups(makeReportGroups(reports));
  }, [reports]);

  useEffect(() => {
    const resetIfNoMatch = true;
    smartLoadFile(null, resetIfNoMatch);
  }, [showFilters]);

  useEffect(() => {
    if (selectedReportGroup
      && selectedReportGroup.id !== previousSelectedGroupId.current) {
      const newSelectedGroup = true;
      currentlySelectedGroupIndex.current = reportGroups
        .findIndex(
          (reportGroup) =>
            reportGroup.id === selectedReportGroup.id
        );
      previousSelectedGroupId.current = selectedReportGroup.id;
      recalibrateYMD(selectedReportGroup.value);
      smartLoadFile(newSelectedGroup);
    }
  }, [selectedReportGroup]);

  useEffect(() => {
    handleYearSelection(selectedYear);
    setSelectedMonth(null);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedReportGroup?.daily) {
      if (selectedMonth?.value !== null) {
        const result = populateDays();
        setSelectedDay(null);
        if (result?.filteredReports) {
          setFiltered(result.filteredReports);
        }
      } else {
        setReportsByDay([]);
      }
    } else {
      getFileForSelectedMonth();
    }
  }, [selectedMonth]);

  useEffect(() => {
    getFileForSelectedDay();
  }, [selectedDay]);

  useEffect(() => {
    if (filtered.length === 1 && (!showFilters ||
      (selectedYear && selectedMonth && (selectedDay || !selectedReportGroup?.daily)))) {
      if (!showFilters) {
        if (selectedReportGroup) {
          setFileSelection(currentReport);
        } else {
          setFileSelection(null);
        }
      } else {
        setFileSelection(filtered[0]);
      }
      setFilteredReport(filtered[0]);
    } else {
      setFileSelection(null);
      setFilteredReport(null);
    }
  }, [filtered]);

  return (
    <>
      {selectedReportGroup && (
      <>
        {reportGroups.length > 1 && (
          <>
          <h3 data-testid="filterReportHeader" className={filterHeader}>Choose Report:</h3>
          <div className={filterContainer}>
            <div className={selectWrapper}>
              <ComboCurrencySelect
                changeHandler={changeHandler}
                label="Report "
                optionLabelKey="label"
                options={reportGroups}
                selectedOption={selectedReportGroup}
                searchBarLabel="Search reports"
                required
                containerBorder
              />
            </div>
          </div>
            <div className={extraMarginBottom}> </div>
          </>
          )}
      <h3 data-testid="filterHeader" className={filterHeader}>Select Report Date:</h3>
      <CurrentReportToggle reports={selectedReportGroup}
                           onChange={toggleCurrentReport}
                           filteredByDateSelection={filtered}
      />

      <div className={showFilters ? '' : hiddenFilters} data-testid="filterCollapsible">
        <div className={`${filterContainer} ${selectedReportGroup?.daily ? dailyReport : ''}`}>
          <div className={selectWrapper}>

            {reportsByYear.length > 11 ? (
                <ComboSelect changeHandler={setSelectedYear}
                               optionLabelKey="label"
                               options={reportsByYear.slice(1)}
                               selectedOption={selectedYear}
                               yearFilter={true}
                               required={true}
                               scrollable={true}
                />
            ) : (
              <SelectControl changeHandler={setSelectedYear}
                             label={label}
                             optionLabelKey="label"
                             options={reportsByYear}
                             selectedOption={selectedYear}
              />
            )}

          </div>
          {reportsByMonth.length > 0 && (
            <>
              <div data-testid="month-wrapper" className={selectWrapper}>
                <SelectControl changeHandler={setSelectedMonth}
                               label={monthLabel}
                               optionLabelKey="label"
                               options={reportsByMonth}
                               selectedOption={selectedMonth}
                />
              </div>
              {(selectedMonth?.value !== null && reportsByDay?.length > 0 &&
                selectedReportGroup.daily) && (
                <div data-testid="day-wrapper" className={selectWrapper}>
                <SelectControl changeHandler={setSelectedDay}
                label={dayLabel}
                optionLabelKey="label"
                options={reportsByDay}
                selectedOption={selectedDay}
                />
                </div>
              )}
            </>
          )}
        </div>
        {reportsTip && (
          <div data-testid="reports-tip" className={publishReportTip}>
            <div className={iconContainer}>
              <FontAwesomeIcon icon={faInfoCircle}
                               className={infoIcon}
                               alt="info icon"
              />
            </div>
            <span>{reportsTip}</span>
          </div>
        )}
      </div>
      </>
    )}
    </>
  )
}

export default FilterSection;
