import React from 'react';
import classNames from 'classnames';
import {
  dropdownContainer,
  dropdownListItem,
  dropdownListItem_Button,
  dropdownList,
  dropdownListItem_Selected,
  searchBarContainer
} from './combo-select-dropdown.module.scss';
import SearchBar from './search-bar';

const ComboSelectDropdown = (
  {
    active,
    onBlurHandler,
    setMouseOverDropdown,
    filteredOptions,
    filter,
    changeHandler,
    selectedOption,
    updateSelection,
    required,
    disabledMessage,
    optionLabelKey
  }) => {
  console.log(filter);

  return (
    <>
      {active && (
        <div className={dropdownContainer} data-testid="dropdown-container">
          <div className={searchBarContainer}>
            <SearchBar onChange={changeHandler} width={288} filter={filter} label="Search currencies" />
          </div>
          <ul
            role={'presentation'}
            onBlur={onBlurHandler}
            onMouseDown={() => setMouseOverDropdown(true)}
            onMouseLeave={() => setMouseOverDropdown(false)}
            className={dropdownList}
          >
            {filteredOptions.map((option, index) => {
              return (
                <React.Fragment key={index}>
                  <li className={
                    classNames([
                      dropdownListItem, option.label === selectedOption.label ?
                        dropdownListItem_Selected : '',
                    ])}
                  >
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <div
                      role='button'
                      className={dropdownListItem_Button}
                      onClick={() => updateSelection(option, true)}
                      disabled={required && !option.value}
                      title={(required && !option.value && disabledMessage) && disabledMessage}
                    >
                      {option[optionLabelKey]}
                    </div>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </>
  )
}

export default ComboSelectDropdown;
