import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { InputAdornment, MuiThemeProvider } from '@material-ui/core';
import {
  search,
  headerContainer,
  title,
  bookIcon,
  searchIcon,
  header,
  closeIcon,
  closeButton,
  searchLabel
} from './glossary-header.module.scss'
import { searchBarTheme } from './theme';

interface IGlossaryHeader {
  clickHandler: (e) => void,
  filter: string,
  filterHandler: (e) => void
}

//TODO: Fix list blur after click back
// Adjust style of search bar

const GlossaryHeader:FunctionComponent<IGlossaryHeader> = ({clickHandler, filter, filterHandler}) => {
  const onSearchBarChange = (event) => {
    const val = (event && event.target) ? event.target.value : '';
    filterHandler(val);
  }


  return (
    <div className={headerContainer}>
      <div className={header}>
        <div className={title}>
          <FontAwesomeIcon icon={faBook as IconProp} className={bookIcon} />
          GLOSSARY
        </div>
        <button onClick={clickHandler} className={closeButton} aria-label={'Close glossary'}>
          <FontAwesomeIcon icon={faXmark as IconProp} className={closeIcon} />
        </button>
      </div>
      <div className={search}>
        <span className={searchLabel}>Search the glossary</span>
        <MuiThemeProvider theme={searchBarTheme} >
          <Box sx={{width: 280}}>
            <TextField
              variant="outlined"
              fullWidth
              onChange={onSearchBarChange}
              size="small"
              value={filter}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" >
                    <FontAwesomeIcon icon={faMagnifyingGlass as IconProp} className={searchIcon} />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </MuiThemeProvider>
      </div>
    </div>
  )
}

export default GlossaryHeader;
