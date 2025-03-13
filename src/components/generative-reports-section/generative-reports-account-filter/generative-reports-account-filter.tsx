import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { IPublishedReportDataJson } from '../../../models/IPublishedReportDataJson';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import AccountBox from '@material-ui/icons/AccountBox';

interface IReportFilter {
  reports: IPublishedReportDataJson[];
  setAllReports: (reportGroup: IPublishedReportDataJson[]) => void;
}

const GenerativeReportsAccountFilter: FunctionComponent<IReportFilter> = ({ reports, setAllReports }: IReportFilter) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [active, setActive] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({
    label: '(None selected)',
    value: 0,
  });

  const accountOptions = [
    selectedAccount,
    {
      label: 'Real Account Name',
      value: 1,
    },
  ];

  const onAccountChange = account => {
    if (account !== null && account?.value) {
      setSelectedAccount(account);
      setAllReports(account.value);
      setTimeout(() => {
        setActive(false);
      });
    }
  };

  const dropdownButton = (
    <DropdownLabelButton selectedOption={selectedAccount?.label} label="Account" active={active} setActive={setActive} muiIcon={<AccountBox />} />
  );

  return (
    <>
      <DropdownContainer setActive={setActive} dropdownButton={dropdownButton}>
        <ComboSelectDropdown
          active={active}
          setDropdownActive={setActive}
          selectedOption={selectedAccount}
          updateSelection={onAccountChange}
          searchBarLabel="Search reports"
          options={accountOptions}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
        />
      </DropdownContainer>
    </>
  );
};

export default GenerativeReportsAccountFilter;
