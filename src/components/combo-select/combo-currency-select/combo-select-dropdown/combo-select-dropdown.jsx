import React, {useState} from 'react';
import classNames from 'classnames';
import {
  dropdownContainer,
  dropdownListItem,
  dropdownListItem_Button,
  dropdownList,
  dropdownListItem_Selected,
  searchBarContainer,
  unmatchedTerm,
  noMatch
} from './combo-select-dropdown.module.scss';
import SearchBar from '../../../search-bar/search-bar';
import { underlineMatchedString } from '../../../search-bar/search-bar-helper';
import ScrollContainer from '../../../scroll-container/scroll-container';
import { filterYearOptions } from '../../../published-reports/util/util';

const ComboSelectDropdown = (
  {
    active,
    setDropdownActive,
    dropdownOnBlurHandler,
    searchBarOnBlurHandler,
    setMouseOverDropdown,
    selectedOption,
    updateSelection,
    required,
    disabledMessage,
    optionLabelKey,
    searchBarActive,
    setSearchBarActive,
    inputRef,
    options,
    yearFilter,
    changeHandler,
    timeOutId,
  }) => {
  const [filterValue, setFilterValue] = useState('');
  const [scrollTop, setScrollTop] = useState(true);
  const [filteredOptions, setFilteredOptions] = useState(options);

  const filterOptionsByEntry = (opts, entry) => {
    let filteredList = opts;
    if (entry?.length) {
      filteredList = opts.filter(opt => opt.label.toUpperCase().includes(entry.toUpperCase()));
    }
    return filteredList;
  };

  const clearFilter = () => {
    changeHandler(null);
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: ''
      }
    });
    setFilterValue('');
  };
  const onFilterChange = (event) => {
    const val = (event && event.target) ? event.target.value : '';
    setFilterValue(val);
    const localFilteredOptions = yearFilter ?
      filterYearOptions(options, val) :
      filterOptionsByEntry(options, val);
    setFilteredOptions(localFilteredOptions);
    if (localFilteredOptions.length === 1
      && (localFilteredOptions[0].value
        && localFilteredOptions[0].value.toString() === val)) {
      updateSelection(localFilteredOptions[0], false);
    } else {
      clearTimeout(timeOutId);
      setDropdownActive(true);
    }
  };

  const onBlur = (listFocus, event) => {
    setMouseOverDropdown(false);
    dropdownOnBlurHandler(event, listFocus);
  }

  return (
    <>
      {active && (
        <div className={dropdownContainer} data-testid="dropdown-container"
             onMouseOver={() => setMouseOverDropdown(true)}
             onMouseLeave={() => setMouseOverDropdown(false)}
             onBlur={() => onBlur(false)}
             onFocus={() => setMouseOverDropdown(true)}
             role="presentation"
        >
          <div className={searchBarContainer}>
            <SearchBar
              onChange={onFilterChange}
              onBlur={searchBarOnBlurHandler}
              filter={filterValue}
              label="Search currencies"
              handleClear={clearFilter}
              active={searchBarActive}
              setActive={setSearchBarActive}
              inputRef={inputRef}
            />
          </div>
          <ScrollContainer
            list={filteredOptions}
            selection={selectedOption}
            scrollTop={scrollTop}
            setScrollTop={setScrollTop}
          >
            {filteredOptions.length === 0 ? (
              <div className={noMatch}>
                No match for <span className={unmatchedTerm}>'{filterValue}'</span>.
                Please revise your search and try again.
              </div>
            ) : (
              <ul
                role="presentation"
                onBlur={() => onBlur(true)}
                className={dropdownList}
                data-testid="dropdown-list"
              >
                {filteredOptions.map((option, index) => {
                  return (
                    <React.Fragment key={index}>
                      <li className={
                        classNames([
                          dropdownListItem, option?.label === selectedOption?.label ?
                            dropdownListItem_Selected : '',
                        ])}
                      >
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                        <button
                          className={dropdownListItem_Button}
                          onClick={() => updateSelection(option, true)}
                          disabled={required && !option.value}
                          title={(required && !option.value && disabledMessage) ? disabledMessage : null}
                          aria-label={option.label}
                        >
                          {underlineMatchedString(option[optionLabelKey], filterValue)}
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            )}
          </ScrollContainer>
        </div>
      )}
    </>
  )
}

export default ComboSelectDropdown;
