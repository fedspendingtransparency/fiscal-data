import React, { useState } from 'react';
import {
  buttonGroup,
  toggleButton,
  selected,
  buttonDescription,
  radio
} from './report-data-toggle.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileDownload, faTable } from "@fortawesome/free-solid-svg-icons";
import { makeStyles } from "@material-ui/core/styles";
import { useEffect } from 'react';

const useStyles = makeStyles(() => ({
  publishedReport: {
    fontSize: '1rem'
  },
  rawData: {
    fontSize: '1rem'
  }
}));

const getDisplayStatus = (reports) => {
  return reports && reports.length > 0 ? 'block' : 'none';
};

const ReportDataToggle = ({ onChange, reports }) => {
  const [activeState, setActiveState] = useState(1);
  const [display, setDisplay] = useState(getDisplayStatus(reports));
  const faStyles = useStyles();

  // button group configuration
  const buttons = [
    {
      description: 'Raw Data',
      value: 1,
      icon: <FontAwesomeIcon classes={faStyles.rawData}
                             icon={faTable}
                             data-test-id="table-icon"
            />
    },
    {
      description: 'Published Reports',
      value: 2,
      icon: <FontAwesomeIcon classes={faStyles.publishedReport}
                             icon={faFileDownload}
                             data-test-id="report-icon"
            />
    }
  ]

  const toggleState = (value) => {
    setActiveState(value);
    onChange(value);
  };

  useEffect(() => {
    setDisplay(getDisplayStatus(reports));
  }, [reports]);

  return (
    <div className={buttonGroup}
         data-toggle="buttons"
         style={{ display: display }}
    >
      {buttons.map( radioBtn => (
        <label key={`report-toggle-${radioBtn.value}`}
               className={`${toggleButton} ${activeState === radioBtn.value ? selected : ''}`}
        >
          {radioBtn.icon}
          <div className={buttonDescription}>{radioBtn.description}</div>
          <input type="radio"
                 checked={activeState === radioBtn.value ? 'checked' : ''}
                 className={`${radio} ${radioBtn.description.split(' ').join('')}`}
                 value={radioBtn.value}
                 name="reportData"
                 onChange={() => toggleState(radioBtn.value)}
          />
        </label>
        )
      )}
    </div>
  )
};
export default ReportDataToggle;
