import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import {
  dropdownContainer,
  dropdownListItem,
  dropdownListItem_Button,
  dropdownList,
  dropdownListItem_Selected,
  searchBarContainer,
  unmatchedTerm,
  noMatch,
  sectionLabel,
  dropdownListItem_child,
} from './combo-select-dropdown.module.scss';
import SearchBar from '../../../search-bar/search-bar';
import { underlineMatchedString } from '../../../search-bar/search-bar-helper';
import ScrollContainer from '../../../scroll-container/scroll-container';
import { filterYearOptions } from '../../../published-reports/util/util';

const ComboSelectDropdown = ({
  active,
  setDropdownActive,
  searchBarOnBlurHandler,
  setMouseOverDropdown,
  selectedOption,
  updateSelection,
  required,
  disabledMessage,
  optionLabelKey = 'label',
  searchBarActive,
  setSearchBarActive,
  inputRef,
  options,
  yearFilter,
  changeHandler,
  timeOutId,
  searchBarLabel,
  hasChildren,
}) => {
  const [filterValue, setFilterValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [noResults, setNoResults] = useState(false);
  const dropdownRef = useRef(null);
  const filterOptionsByEntry = (opts, entry) => {
    let filteredList = [];
    if (entry?.length && !hasChildren) {
      filteredList = opts.filter(opt => opt[optionLabelKey].toUpperCase().includes(entry.toUpperCase()));
      setNoResults(filteredList.length === 0);
    } else if (hasChildren) {
      let sectionResults;
      let allResultsLength = 0;
      opts.forEach(section => {
        sectionResults = section.children.filter(opt => opt[optionLabelKey].toUpperCase().includes(entry.toUpperCase()));
        allResultsLength += sectionResults.length;
        filteredList.push({ label: section.label, children: sectionResults });
      });
      setNoResults(allResultsLength === 0);
    } else {
      filteredList = opts;
    }
    return filteredList;
  };

  const clearFilter = () => {
    changeHandler(null);
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: '',
      },
    });
    setFilterValue('');
  };

  const filterDropdown = val => {
    const localFilteredOptions = yearFilter ? filterYearOptions(options, val) : filterOptionsByEntry(options, val);
    setFilteredOptions(localFilteredOptions);
    if (localFilteredOptions.length === 1 && localFilteredOptions[0].value && localFilteredOptions[0].value.toString() === val) {
      updateSelection(localFilteredOptions[0], false);
    } else {
      clearTimeout(timeOutId);
      setDropdownActive(true);
    }
  };

  const onFilterChange = event => {
    const val = event && event.target ? event.target.value : '';
    setFilterValue(val);
    filterDropdown(val);
  };

  useEffect(() => {
    setFilteredOptions(options);
    if (filterValue !== '') {
      filterDropdown(filterValue);
      setDropdownActive(false);
    }
  }, [options]);
  const handleDropdownInteraction = event => {
    event.stopPropagation();
  };

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownActive(false);
    }
  };

  useEffect(() => {
    if (active) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [active]);

  const filteredOptionButton = (option, child) => (
    <li
      className={classNames([
        dropdownListItem,
        option[optionLabelKey] === selectedOption[optionLabelKey] && dropdownListItem_Selected,
        child && dropdownListItem_child,
      ])}
    >
      <button
        className={dropdownListItem_Button}
        onClick={() => updateSelection(option, true)}
        disabled={required && !option.value}
        title={required && !option.value && disabledMessage ? disabledMessage : null}
        aria-label={option[optionLabelKey]}
        data-testid="dropdown-list-option"
      >
        {underlineMatchedString(option[optionLabelKey], filterValue)}
      </button>
    </li>
  );

  return (
    <>
      {active && (
        <div
          className={dropdownContainer}
          data-testid="dropdown-container"
          onMouseOver={() => setMouseOverDropdown(true)}
          onMouseLeave={() => setMouseOverDropdown(false)}
          ref={dropdownRef}
          onFocus={() => setMouseOverDropdown(true)}
          onMouseDown={handleDropdownInteraction}
          role="presentation"
        >
          <div className={searchBarContainer}>
            <SearchBar
              onChange={onFilterChange}
              onBlur={searchBarOnBlurHandler}
              filter={filterValue}
              label={searchBarLabel}
              handleClear={clearFilter}
              active={searchBarActive}
              setActive={setSearchBarActive}
              inputRef={inputRef}
            />
          </div>
          <ScrollContainer deps={[filteredOptions, selectedOption, filterValue]}>
            {noResults ? (
              <div className={noMatch}>
                No match for <span className={unmatchedTerm}>'{filterValue}'</span>. Please revise your search and try again.
              </div>
            ) : (
              <ul className={dropdownList} data-testid="dropdown-list" style={{ maxHeight: '11.875rem' }}>
                {hasChildren &&
                  filteredOptions.map((section, index) => {
                    return (
                      <React.Fragment key={index}>
                        {section.children.length > 0 && <div className={sectionLabel}>{section.label}</div>}
                        {section.children.map((option, i) => {
                          return <React.Fragment key={i}>{filteredOptionButton(option, true)}</React.Fragment>;
                        })}
                      </React.Fragment>
                    );
                  })}
                {!hasChildren &&
                  filteredOptions.map((option, index) => {
                    return <React.Fragment key={index}>{filteredOptionButton(option)}</React.Fragment>;
                  })}
              </ul>
            )}
          </ScrollContainer>
        </div>
      )}
    </>
  );
};

export default ComboSelectDropdown;
