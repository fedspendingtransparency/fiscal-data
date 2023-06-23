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
import { searchBarTheme, useStyles } from './theme';
import SearchBar from '../../combo-select/search-bar';

interface IGlossaryHeader {
  filter: string,
  clickHandler: (e) => void,
  filterHandler: (e) => void,
  glossaryRef: any,
}


const GlossaryHeader:FunctionComponent<IGlossaryHeader> = ({filter, clickHandler, filterHandler, glossaryRef}) => {
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
        <button onClick={clickHandler} onKeyPress={clickHandler} className={closeButton} aria-label={'Close glossary'} ref={glossaryRef}>
          <FontAwesomeIcon icon={faXmark as IconProp} className={closeIcon} />
        </button>
      </div>
      <SearchBar onChange={onSearchBarChange} width={282} filter={filter} label="Search the glossary" />
    </div>
  )
}

export default GlossaryHeader;
