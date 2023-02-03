import React, {FunctionComponent, useEffect, useState} from "react";
import {
  userFilterWrapper,
  filterLabel,
  infoContainer
} from './user-filter.module.scss';
import ComboSelect from "../../combo-select/combo-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {IDatasetApi} from "../../../models/IDatasetApi";
import { info, icon } from '../../dataset-data/dataset-chart/dataset-chart.module.scss';

type UserFilterProps = {
  selectedTable: IDatasetApi,
  onUserFilter: (selection: any) => void,
  apiData: any
}

// hopefully this TS workaround will no longer be needed with newer versions of FontAwesome
const infoCirclePropIcon = faInfoCircle as IconProp;
const UserFilter: FunctionComponent<UserFilterProps> = (
  {
    selectedTable,
    onUserFilter,
    apiData
  }) => {

  const [userFilterOptions, setUserFilterOptions] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState(null);

  const updateUserFilter = selection => {
    setSelectedFilterOption(selection);
    onUserFilter(selection);
  }

  const establishOptions = () => {
    let options = null;
    if (apiData?.data && userFilterOptions === null) {
      const values = [...new Set(apiData.data.map(row => row[selectedTable.userFilter.field]))];
      options = values.map(val => ({label: val, value: val}));
      options.unshift({label: '(None selected)', value: null});
      setUserFilterOptions(options);
    }
  };

  useEffect(() => {
    establishOptions();
  }, [apiData])

  return (
    <>
      {(selectedTable.userFilter && userFilterOptions) && (
        <div className={userFilterWrapper}>
          <ComboSelect
            label={`${selectedTable.userFilter.label}:`}
            labelClass={filterLabel}
            options={userFilterOptions}
            changeHandler={updateUserFilter}
            selectedOption={selectedFilterOption}
            scrollable={true}
          />
        </div>
      )}
      {(selectedTable?.userFilter?.notice) && (
        <div className={infoContainer}>
          <div className={info} data-testid="userFilterNotice">
            <FontAwesomeIcon className={icon} icon={infoCirclePropIcon} />
            {selectedTable.userFilter.notice}
          </div>
        </div>
      )}
    </>
  )
}

export default UserFilter;
