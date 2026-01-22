import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import { faFileLines } from '@fortawesome/free-regular-svg-icons/faFileLines';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { makeReportGroups } from '../util/util';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import { IPublishedReportGroup } from '../../../models/IPublishedReportGroup';

interface IReportFilter {
  reports: IPublishedReportDataJson[];
  setAllReports: (reportGroup: IPublishedReportDataJson[]) => void;
}

const ReportFilter: FunctionComponent<IReportFilter> = ({ reports, setAllReports }: IReportFilter) => {
  const [reportGroups, setReportGroups] = useState([]);
  const [selectedReportGroup, setSelectedReportGroup] = useState<IPublishedReportGroup>();
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setReportGroups(makeReportGroups(reports));
  }, [reports]);

  useEffect(() => {
    if (reportGroups) {
      setSelectedReportGroup(reportGroups[0]);
      setAllReports(reportGroups[0]?.value);
    }
  }, [reportGroups]);

  const onReportChange = (report: IPublishedReportGroup) => {
    if (report !== null && report?.value) {
      setSelectedReportGroup(report);
      setAllReports(report.value);
      setTimeout(() => {
        setActive(false);
      });
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
