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
import ScrollContainer from '../../../search-bar/scroll-container';

const ComboSelectDropdown = (
  {
    active,
    onBlurHandler,
    setMouseOverDropdown,
    filteredOptions,
    selectedOption,
    updateSelection,
    required,
    disabledMessage,
    optionLabelKey,
    filter,
    onChange,
    onClear,
    searchBarActive,
    setSearchBarActive
  }) => {
  const [filterValue, setFilterValue] = useState('');
  const [scrollTop, setScrollTop] = useState(true);
  const change = (event) => {
    const val = (event && event.target) ? event.target.value : '';
    setFilterValue(val);
    onChange(event);
  }

  const clearSearchBar = () => {
    onClear();
    setFilterValue('');
  }

  return (
    <>
      {active && (
        <div className={dropdownContainer} data-testid="dropdown-container">
          <div className={searchBarContainer}>
            <SearchBar
              onChange={change}
              width={288}
              filter={filterValue}
              label="Search currencies"
              handleClear={clearSearchBar}
              active={searchBarActive}
              setActive={setSearchBarActive}
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
                        <button
                          className={dropdownListItem_Button}
                          onClick={() => updateSelection(option, true)}
                          disabled={required && !option.value}
                          title={(required && !option.value && disabledMessage) && disabledMessage}
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
