import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import { faFileLines } from '@fortawesome/free-regular-svg-icons';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { makeReportGroups } from '../util/util';
import { IReports } from '../reports-section/reports-section';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface IReportFilter {
  reports: IReports[];
}

const ReportFilter: FunctionComponent<IReportFilter> = ({ reports }: IReportFilter) => {
  const [reportGroups, setReportGroups] = useState({});
  const [selectedReportGroup, setSelectedReportGroup] = useState<IReports>();
  const [searchBarActive, setSearchBarActive] = useState(false);

  useEffect(() => {
    setReportGroups(makeReportGroups(reports));
  }, [reports]);

  useEffect(() => {
    if (reportGroups) {
      setSelectedReportGroup(reportGroups[0]);
    }
  }, [reportGroups]);

  const [active, setActive] = useState(false);

  const onReportChange = (report: IReports) => {
    if (report !== null) {
      setSelectedReportGroup(report);
      setActive(false);
    }
  };

  const dropdownButton = (
    <DropdownLabelButton
      selectedOption={selectedReportGroup?.label}
      label="Report"
      icon={faFileLines as IconDefinition}
      active={active}
      setActive={setActive}
    />
  );

  return (
    <>
      <DropdownContainer setActive={setActive} dropdownButton={dropdownButton}>
        <ComboSelectDropdown
          active={active}
          setDropdownActive={setActive}
          selectedOption={selectedReportGroup}
          updateSelection={onReportChange}
          searchBarLabel="Search reports"
          options={reportGroups}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
        />
      </DropdownContainer>
    </>
  );
};

export default ReportFilter;
