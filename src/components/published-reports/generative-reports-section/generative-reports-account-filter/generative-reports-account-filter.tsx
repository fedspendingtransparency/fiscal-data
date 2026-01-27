import React, { FunctionComponent, useEffect, useState } from 'react';
import DropdownContainer from '../../../dropdown-container/dropdown-container';
import ComboSelectDropdown from '../../../combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import DropdownLabelButton from '../../../dropdown-label-button/dropdown-label-button';
// import AccountBox from '@mui/icons-material/AccountBox';
import { IDatasetApi } from '../../../../models/IDatasetApi';
import { defaultSelection } from '../generative-reports-section';
import { container } from './generative-reports-account-filter.module.scss';

interface IAccountFilter {
  apiData: IDatasetApi[];
  selectedAccount;
  setSelectedAccount;
}

interface IAccountOptions {
  default?: boolean;
  label?: string;
  children: {
    label: string;
    value: string;
  }[];
}

const GenerativeReportsAccountFilter: FunctionComponent<IAccountFilter> = ({ apiData, selectedAccount, setSelectedAccount }: IAccountFilter) => {
  const [searchBarActive, setSearchBarActive] = useState(false);
  const [active, setActive] = useState(false);
  const defaultOptions: IAccountOptions[] = [{ default: true, children: [defaultSelection] }];

  const [accountOptions, setAccountOptions] = useState(defaultOptions);

  useEffect(() => {
    const options: IAccountOptions[] = [{ default: true, children: [defaultSelection] }];
    const optionSet = apiData?.map(api => api.apiFilter?.fieldFilter?.value)?.flat() || [];
    const filterOptions = [...new Set(optionSet)];
    const flattenApi = filter => {
      const values = filter
        ? apiData
            .map(api => api?.apiFilter?.optionValues[filter])
            .filter(item => item?.length)
            .flat()
            .filter(item => item !== 'null')
        : [];
      return [...new Set(values)];
    };
    filterOptions.forEach(filter =>
      filter
        ? options.push({
            label: filter,
            children: flattenApi(filter).map(val => ({
              label: val,
              value: val,
            })),
          })
        : null
    );
    setAccountOptions(options);
  }, []);

  const onAccountChange = account => {
    if (account !== null) {
      setSelectedAccount(account);
      setTimeout(() => {
        setActive(false);
      });
    }
  };

  const dropdownButton = (
    <DropdownLabelButton selectedOption={selectedAccount?.label} label="Account" active={active} setActive={setActive} muiIcon={<></>} />
  );

  return (
    <div className={container}>
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
          hasChildren={true}
        />
      </DropdownContainer>
    </div>
  );
};

export default GenerativeReportsAccountFilter;
