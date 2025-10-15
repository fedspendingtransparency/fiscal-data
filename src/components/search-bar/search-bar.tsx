import { clearButton, disabledBackground, glow, search, searchIcon, searchIconHover, searchLabel } from './search-bar.module.scss';
import { InputAdornment, ThemeProvider } from '@mui/material';
import { searchBarTheme } from '../glossary/glossary-header/theme';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import React, { ChangeEventHandler, FocusEventHandler, FunctionComponent, Ref } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ISearchBar {
  label?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  filter: string;
  handleClear?: () => void;
  active?: boolean;
  setActive?: (value: boolean) => void;
  inputRef?: Ref<HTMLDivElement>;
  width?: string;
  height?: string;
  ariaLabel?: string;
  disabled?: boolean;
  hideIcons?: boolean;
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
  hideIcons,
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

  const handleBlur: FocusEventHandler<HTMLDivElement> = event => {
    if (onBlur) {
      onBlur(event);
    }
    if (setActive) {
      setActive(false);
    }
  };

  const icon =
    filter?.length > 0 && handleClear ? (
      <button onClick={clearBox} onKeyDown={clearBox} aria-label="Clear search bar" className={clearButton}>
        <FontAwesomeIcon icon={faTimesCircle as IconProp} className={`${searchIcon} ${searchIconHover}`} border />
      </button>
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
        <ThemeProvider theme={searchBarTheme}>
          <Box sx={{ width: width, fontSize: '1rem' }}>
            <TextField
              ref={inputRef}
              variant="outlined"
              fullWidth
              onChange={onChange}
              size="small"
              value={filter}
              aria-label={label}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">{!hideIcons && icon}</InputAdornment>,
                  style: {
                    height: height,
                  },
                },
                htmlInput: {
                  'aria-label': ariaLabel ? ariaLabel : label,
                },
              }}
              disabled={disabled}
            />
          </Box>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default SearchBar;
