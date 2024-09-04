import React, { useEffect, useState } from 'react';
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

  const filterOptionsByEntry = (opts, entry) => {
    console.log('here');
    let filteredList = [];
    if (entry?.length && !hasChildren) {
      filteredList = opts.filter(opt => opt[optionLabelKey].toUpperCase().includes(entry.toUpperCase()));
    } else if (hasChildren) {
      let temp;
      opts.forEach(section => {
        temp = section.children.filter(opt => opt[optionLabelKey].toUpperCase().includes(entry.toUpperCase()));
        console.log(temp, section);
        filteredList.push({ label: section.label, children: temp });
      });
      console.log(opts);
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

  const handleBlur = event => {
    // prevents dropdown from close when tabbing into a child
    if (event) {
      let dropdownChild;
      switch (event.target.localName) {
        case 'input':
          dropdownChild = true;
          break;
        case 'svg':
          dropdownChild = filteredOptions.length > 0;
          break;
        case 'button':
          dropdownChild = event.target.parentElement.parentElement.parentElement.parentElement.parentElement.contains(event.relatedTarget);
          break;
        default:
          dropdownChild = false;
          break;
      }
      setMouseOverDropdown(false);
      if (!dropdownChild) {
        timeOutId = setTimeout(() => {
          setDropdownActive(false);
        });
      }
    }
  };

  const filteredOptionButton = (option, index) => (
    <React.Fragment key={index}>
      <li className={classNames([dropdownListItem, option[optionLabelKey] === selectedOption[optionLabelKey] ? dropdownListItem_Selected : ''])}>
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
    </React.Fragment>
  );

  return (
    <>
      {active && (
        <div
          className={dropdownContainer}
          data-testid="dropdown-container"
          onMouseOver={() => setMouseOverDropdown(true)}
          onMouseLeave={() => setMouseOverDropdown(false)}
          onBlur={handleBlur}
          onFocus={() => setMouseOverDropdown(true)}
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
            {filteredOptions.length === 0 ? (
              <div className={noMatch}>
                No match for <span className={unmatchedTerm}>'{filterValue}'</span>. Please revise your search and try again.
              </div>
            ) : (
              <ul className={dropdownList} data-testid="dropdown-list" style={{ height: filteredOptions.length > 5 ? '11.875rem' : '12rem' }}>
                {hasChildren &&
                  filteredOptions.map((section, index) => {
                    return (
                      <>
                        <div className={sectionLabel}>{section.label}</div>
                        {section.children.map(option => {
                          // console.log(option, option[optionLabelKey]);
                          return <>{filteredOptionButton(option, index)}</>;
                        })}
                      </>
                    );
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
