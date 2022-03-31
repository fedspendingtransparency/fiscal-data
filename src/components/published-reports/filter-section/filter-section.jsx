import React, { useEffect, useState, useRef } from 'react';
import {
  filterHeader,
  filterContainer,
  selectWrapper,
  extraMarginBottom,
  hiddenFilters,
  publishReportTip,
  infoIcon,
  iconContainer
} from "./filter-section.module.scss";
import SelectControl from "../../select-control/select-control";
import { getYearReportOptions, getMonthOptions } from "../util/util";
import CurrentReportToggle from '../../dataset-data/current-report-toggle/current-report-toggle';
import { getLatestReport } from '../../../helpers/dataset-detail/report-helpers';
import ComboSelect from '../combo-select/combo-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle"

export const FilterSection = ({ reports, setSelectedFile, reportsTip }) => {
  const [reportsByYear, setReportsByYear] = useState(getYearReportOptions(reports));
  const [reportsByMonth, setReportsByMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
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
  const reportLabel =
      <span data-testid="reportLabel">
        Report <span className="required">*</span>
      </span>;

  const populateYears = (reportVal) => {
    const availableYears = getYearReportOptions(reportVal);
    setReportsByYear(availableYears);
    return availableYears;
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
      }
    }
  };

  const toggleCurrentReport = (currentReport) => {
    if (currentReport === false) {
      setShowFilters(true);
      return;
    }

    setCurrentReport(currentReport);
    setSelectedFile(currentReport ? currentReport : filteredReport);
    setShowFilters(!currentReport);
  };

  const makeReportGroups = (reports) => {
    const tempObj = {};
    reports.forEach((report) => {
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
        sortOrderNumber: val[0].report_group_sort_order_nbr
      })
    });
    return groups.sort((a, b) => {return a.sortOrderNumber - b.sortOrderNumber});
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

  /*
   * This function is called when switching report groups. We need to repopulate the years and
   * months in the dropdowns and assess if we can use the same selected year/month with the
   *  newest selected report group.
   */
  const recalibrateYM = (reportVal) => {
    const availableYears = populateYears(reportVal);
    const selectedYearValue = selectedYear ? selectedYear.value : null;
    const selectedMonthValue = selectedMonth ? selectedMonth.value : null;
    let isSelectedYearValid = false;
    let isSelectedMonthValid = false;

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
        }
      }
    }
    if (!isSelectedYearValid) {
      setSelectedYear(null);
    }
    if (!isSelectedMonthValid) {
      setSelectedMonth(null);
    }
  };

  const smartLoadFile = (newSelectedGroup, _resetIfNoMatch) => {

    if (selectedYear && selectedMonth && showFilters) {
      getFileForSelectedMonth();
    } else {

      if (selectedReportGroup && (!showFilters || newSelectedGroup)) {
        if (newSelectedGroup) {
          const latestReportInNewlySelectedGroup = getLatestReport(selectedReportGroup.value);
          toggleCurrentReport(latestReportInNewlySelectedGroup);
        } else {
          setSelectedFile(currentReport);
        }

      } else if (_resetIfNoMatch){
        setSelectedFile(null);
      }
    }
  };

  useEffect(() => {
    // called on page initialization and when reports updates
    if (reportGroups[currentlySelectedGroupIndex.current]) {
      setSelectedReportGroup(reportGroups[currentlySelectedGroupIndex.current]);
      if (!currentReport) {
        const latestReport =
          getLatestReport(reportGroups[currentlySelectedGroupIndex.current].value);
        setCurrentReport(latestReport);
        setSelectedFile(latestReport);
      }
      setReportsByYear(
        getYearReportOptions(reportGroups[currentlySelectedGroupIndex.current].value)
      );
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
      recalibrateYM(selectedReportGroup.value);
      smartLoadFile(newSelectedGroup);
    }
  }, [selectedReportGroup]);

  useEffect(() => {
    handleYearSelection(selectedYear);
    setSelectedMonth(null);
  }, [selectedYear]);

  useEffect(() => {
    getFileForSelectedMonth();
  }, [selectedMonth]);

  useEffect(() => {
    if (filtered.length === 1 && (!showFilters || (selectedYear && selectedMonth))) {
      if (!showFilters) {
        if (selectedReportGroup) {
          setSelectedFile(currentReport);
        } else {
          setSelectedFile(null);
        }
      } else {
        setSelectedFile(filtered[0]);
      }
      setFilteredReport(filtered[0]);
    } else {
      setSelectedFile(null);
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
              <SelectControl changeHandler={setSelectedReportGroup}
                             label={reportLabel}
                             optionLabelKey="label"
                             options={reportGroups}
                             selectedOption={selectedReportGroup}
                             data-testid="reportSelectControl"
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
        <div className={filterContainer}>
          <div className={selectWrapper}>

            {reportsByYear.length > 11 ? (
                <ComboSelect changeHandler={setSelectedYear}
                               optionLabelKey="label"
                               options={reportsByYear.slice(1)}
                               selectedOption={selectedYear}
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
            <div data-testid="month-wrapper" className={selectWrapper}>
              <SelectControl changeHandler={setSelectedMonth}
                             label={monthLabel}
                             optionLabelKey="label"
                             options={reportsByMonth}
                             selectedOption={selectedMonth}
              />
            </div>
          )
          }
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
