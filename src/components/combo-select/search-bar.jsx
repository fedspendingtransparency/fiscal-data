import {
  search,
  searchIcon,
  searchLabel,
} from '../glossary/glossary-header/glossary-header.module.scss';
import { InputAdornment, MuiThemeProvider } from '@material-ui/core';
import { searchBarTheme, useStyles } from '../glossary/glossary-header/theme';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import React from 'react';


const SearchBar = ({label, onChange, filter, width}) => {
  return (
    <div className={search}>
      <span className={searchLabel}>{label}</span>
      <MuiThemeProvider theme={searchBarTheme} >
        <Box sx={{width: width}}>
          <TextField
            className={useStyles().root}
            variant="outlined"
            fullWidth
            onChange={onChange}
            size="small"
            value={filter}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" >
                  <FontAwesomeIcon icon={faMagnifyingGlass} className={searchIcon} />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </MuiThemeProvider>
    </div>
  )
}

export default SearchBar;
