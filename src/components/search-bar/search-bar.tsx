import { search, searchIcon, searchIconHover, searchLabel, glow, disabledBackground } from './search-bar.module.scss';
import { InputAdornment, MuiThemeProvider } from '@material-ui/core';
import { searchBarTheme, useStyles } from '../glossary/glossary-header/theme';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import React, { FunctionComponent } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ISearchBar {
  label?: string;
  onChange: (event) => void;
  onBlur?: () => void;
  filter: string;
  handleClear?: () => void;
  active?: boolean;
  setActive?: (value: boolean) => void;
  inputRef?;
  width?: string;
  height?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const SearchBar: FunctionComponent<ISearchBar> = ({
  label,
  onChange,
  onBlur,
  filter,
  handleClear,
  active,
  setActive,
  inputRef,
  width,
  height,
  ariaLabel,
  disabled,
}) => {
  let searchCleared = false;

  const clearBox = e => {
    if (e.key === undefined || e.key === 'Enter') {
      if (setActive) {
        e.stopPropagation();
        setActive(false);
        searchCleared = true;
      }
      handleClear();
    }
  };

  const handleClick = () => {
    if (!searchCleared && setActive && !disabled) {
      setActive(true);
      searchCleared = false;
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur();
    }

    if (setActive) {
      setActive(false);
    }
  };

  const icon =
    filter?.length > 0 && handleClear ? (
      <FontAwesomeIcon
        icon={faTimesCircle as IconProp}
        className={`${searchIcon} ${searchIconHover}`}
        role="button"
        onClick={clearBox}
        onKeyDown={clearBox}
        tabIndex={0}
        aria-label="Clear search bar"
        border
      />
    ) : (
      <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} className={searchIcon} />
    );

  return (
    <div className={search}>
      <span className={searchLabel}>{label}</span>
      <div
        className={`${glow && active && !disabled ? glow : null} ${disabled ? disabledBackground : null}`}
        onClick={handleClick}
        onBlur={handleBlur}
        role="presentation"
      >
        <MuiThemeProvider theme={searchBarTheme}>
          <Box sx={{ width: width, fontSize: '1rem' }}>
            <TextField
              ref={inputRef}
              className={useStyles().root}
              variant="outlined"
              fullWidth
              onChange={onChange}
              size="small"
              value={filter}
              aria-label={label}
              InputProps={{
                endAdornment: <InputAdornment position="end">{icon}</InputAdornment>,
                style: {
                  height: height,
                },
              }}
              inputProps={{
                'aria-label': ariaLabel ? ariaLabel : label,
              }}
              disabled={disabled}
            />
          </Box>
        </MuiThemeProvider>
      </div>
    </div>
  );
};

export default SearchBar;
