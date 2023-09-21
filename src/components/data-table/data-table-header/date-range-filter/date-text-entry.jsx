import React, { useEffect, useState } from 'react';
import { InputAdornment, MuiThemeProvider } from '@material-ui/core';
import { searchBarTheme, useStyles } from '../../../glossary/glossary-header/theme';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { glow, searchIcon, searchIconHover, search } from '../../../search-bar/search-bar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { calendarIcon } from './date-range-filter.module.scss';

const DateTextEntry = ({ onFilterChange, resetFilters, filter, setFilter, visible, setVisible }) => {
  const [active, setActive] = useState(false);

  let searchCleared = false;

  // const onFilterChange = event => {
  //   const val = event && event.target ? event.target.value : '';
  //   // column.setFilterValue(val);
  //   setFilter(val);
  //   setFiltersActive(val.length > 0);
  // };

  const clearFilter = () => {
    // fire artificial event to reset field
    onFilterChange({
      target: {
        value: '',
      },
    });
    // column.setFilterValue('');
    setFilter('');
  };

  const clearTextBox = e => {
    if (e.key === undefined || e.key === 'Enter') {
      if (setActive) {
        e.stopPropagation();
        setActive(false);
        searchCleared = true;
      }
      onFilterChange();
    }
  };

  const handleTextBoxClick = () => {
    if (!searchCleared && setActive) {
      setActive(true);
      searchCleared = false;
    }
  };

  const icon =
    filter?.length > 0 ? (
      <FontAwesomeIcon
        icon={faTimesCircle}
        className={`${searchIcon} ${searchIconHover}`}
        role="button"
        onClick={clearTextBox}
        onKeyPress={clearTextBox}
        tabIndex={0}
        border
      />
    ) : (
      <FontAwesomeIcon icon={faCalendarDay} onClick={() => setVisible(!visible)} className={calendarIcon} />
    );

  useEffect(() => {
    clearFilter();
  }, [resetFilters]);

  return (
    <>
      <div className={search}>
        <div className={glow && active ? glow : null} onClick={handleTextBoxClick} onBlur={() => setActive(false)} role="presentation">
          <MuiThemeProvider theme={searchBarTheme}>
            <Box sx={{ fontSize: '1rem' }}>
              <TextField
                className={useStyles().root}
                variant="outlined"
                fullWidth
                onChange={onFilterChange}
                size="small"
                value={filter}
                aria-label="Date filter"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
                  style: {
                    height: '28px',
                  },
                }}
              />
            </Box>
          </MuiThemeProvider>
        </div>
      </div>
    </>
  );
};

export default DateTextEntry;
