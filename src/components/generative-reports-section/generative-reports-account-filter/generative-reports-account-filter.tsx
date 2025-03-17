import React, { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import DropdownContainer from '../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../dropdown-label-button/dropdown-label-button';
import AccountBox from '@material-ui/icons/AccountBox';

interface IAccountFilter {
  accounts: {
    Federal: [];
    State: [];
  };
  setAllAccounts: () => void;
}

const GenerativeReportsAccountFilter: FunctionComponent<IAccountFilter> = ({ accounts, setAllAccounts }: IAccountFilter) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [active, setActive] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({
    label: '(None selected)',
    value: 0,
  });
  const [accountOptions, setAccountOptions] = useState([selectedAccount]);

  const formatOptions = (array, label) => {
    return array.map(item => {
      return {
        label: item,
        value: item,
        category: label,
      };
    });
  };

  useEffect(() => {
    const options = accountOptions.concat(formatOptions(accounts.Federal, 'Federal')).concat(formatOptions(accounts.State, 'State'));
    setAccountOptions(options);
    console.log(options);
  }, [setAccountOptions, accountOptions]);

  const onAccountChange = account => {
    if (account !== null && account?.value) {
      setSelectedAccount(account);
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
          searchBarLabel="Search accounts"
          options={accountOptions}
          searchBarActive={searchBarActive}
          setSearchBarActive={setSearchBarActive}
        />
      </DropdownContainer>
    </>
  );
};

export default GenerativeReportsAccountFilter;
