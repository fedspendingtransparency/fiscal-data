import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { makeReportGroups } from '../util/util';

const ReportFilter: FunctionComponent = ({ reports }) => {
  const [reportGroups, setReportGroups] = useState({});
  const [selectedReportGroup, setSelectedReportGroup] = useState();
  const [searchBarActive, setSearchBarActive] = useState(false);

  useEffect(() => {
    const reportGrou = makeReportGroups(reports);
    console.log(reportGrou);
    setReportGroups(reportGrou);
    // setSelectedReportGroup(reports);
  }, [reports]);

  useEffect(() => {
    if (reportGroups) {
      setSelectedReportGroup(reportGroups[0]);
    }
  }, [reportGroups]);

  const [active, setActive] = useState(false);

  const onReportChange = report => {
    setSelectedReportGroup(report);
    setActive(false);
  };

  const dropdownButton = (
    <DropdownLabelButton selectedOption={selectedReportGroup?.label} label="Report" icon={faFileLines} active={active} setActive={setActive} />
  );

  return (
    <>
      <DropdownContainer setActive={setActive} active={active} dropdownButton={dropdownButton}>
        <ComboSelectDropdown
          active={active}
          setDropdownActive={setActive}
          selectedOption={selectedReportGroup}
          updateSelection={onReportChange}
          searchBarLabel="Search reports"
          options={reportGroups}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
          changeHandler={onReportChange}
        />
      </DropdownContainer>
    </>
  );
};

export default ReportFilter;
