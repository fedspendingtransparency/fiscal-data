import React, {useEffect, useState, useRef} from 'react';
import {
  buttonGroup,
  radio,
  toggleButton,
  selected
} from '../report-data-toggle/report-data-toggle.module.scss';
import {
  getDateLabelForReport,
  getLatestReport
} from '../../../helpers/dataset-detail/report-helpers';

export const ReportButtons = {
  NewCurrentReport: 0,
  OriginalCurrentReport: 1,
  PreviousReports: 2
};

const CurrentReportToggle = ({ onChange, reports, filteredByDateSelection }) => {
  const [activeState, setActiveState] = useState(1); // latest report
  const [latestReport, setLatestReport] = useState(null);
  const [reportOptions, setReportOptions] = useState([null, null, null]);

  const previousReportGroupId = useRef();

  const initButtonsForReportGroup = () => {
    const latestReport = getLatestReport(reports.value);
    setLatestReport(latestReport);
    setReportOptions([
      null,
      {
        value: latestReport,
        label: getDateLabelForReport(latestReport, reports.daily)
      },
      {
        value: false,
        label: 'Previous'
      }
    ]);
  };

  const toggleState = (activeTab, value) => {
    setActiveState(activeTab);
    onChange(value);
  };

  const updateButton = (index, label, value) => {
    const updatedButtons = [...reportOptions];
    updatedButtons[index] = {
      label: label,
      value: value
    };
    return updatedButtons;
  };

  useEffect(() => {
    if (!reports) return;

    let reportGroupChanged = false;
    const possiblyNewLatestReport = getLatestReport(reports.value);

    if (possiblyNewLatestReport === latestReport) return;

    reportGroupChanged = (previousReportGroupId.current !== reports.id);
    if (reportGroupChanged) previousReportGroupId.current = reports.id;

    setLatestReport(possiblyNewLatestReport);

    if (reportGroupChanged) {
      initButtonsForReportGroup();
      if (filteredByDateSelection && filteredByDateSelection.length === 1 &&
        filteredByDateSelection[0] === possiblyNewLatestReport) {
        setActiveState(ReportButtons.OriginalCurrentReport);
      }
    } else {
      if ((activeState > ReportButtons.OriginalCurrentReport)) { // User not on latest report

        setReportOptions(
          updateButton(
            ReportButtons.OriginalCurrentReport,
            getDateLabelForReport(possiblyNewLatestReport),
            possiblyNewLatestReport)
        );

      } else { // user is on what is no longer the latest
        setReportOptions(
          updateButton(
            ReportButtons.NewCurrentReport,
            getDateLabelForReport(possiblyNewLatestReport),
            possiblyNewLatestReport)
        );
        setActiveState(ReportButtons.OriginalCurrentReport);
      }
    }
  }, [reports]);

  useEffect(() => {
    initButtonsForReportGroup();
  }, []);

  return (
    <div className={buttonGroup} data-toggle='buttons'>
      { reportOptions && reportOptions.length > 0 && (
        reportOptions.map((option, index) => {

          // not doing a filter to keep indexes aligned
          if (option === null) return <span key={`${index}_container`} />;
          const key = JSON.stringify(option);
          const id = `${option.value ? option.value.path.replace(/\//g, '') : option.label}`;
          return (
            <label className={`${toggleButton} ${activeState === index ? selected : ''}`}
                   htmlFor={id}
                   key={`${key}_label`}
            >
              {option.label}
              <input type='radio'
                     checked={activeState === index ? 'checked' : ''}
                     className={radio}
                     id={id}
                     name='published-report-toggle'
                     onChange={() => toggleState(index, option.value)}
                     key={key}
              />
            </label>
          );
        })
      )
      }
    </div>
  );
};

export default CurrentReportToggle;
