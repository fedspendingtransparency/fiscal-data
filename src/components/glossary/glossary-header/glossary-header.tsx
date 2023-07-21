import React, {FunctionComponent, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faXmark } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  headerContainer,
  title,
  bookIcon,
  header,
  closeIcon,
  closeButton,
} from './glossary-header.module.scss'
import SearchBar from '../../search-bar/search-bar';

interface IGlossaryHeader {
  filter: string,
  clickHandler: (e) => void,
  filterHandler: (e) => void,
  glossaryRef: any,
  tabReset: boolean,
  setTabReset: (e) => void,
}


const GlossaryHeader:FunctionComponent<IGlossaryHeader> = ({filter, clickHandler, filterHandler, glossaryRef, tabReset, setTabReset}) => {

  // useEffect to detect change in setTabReset,
  // which will hold the reference to the specific DOM element
  // document.querySelector(`[data-testid]='glossaryCloseButton'`).focus();
  // .focus()
  // set tabReset to false
  useEffect(() => {
    const glossaryCloseButton = document.querySelector(`[data-testid='glossaryCloseButton']`)
    glossaryCloseButton.focus();
    console.log(glossaryCloseButton);
  }, [tabReset])

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
        <button
          onClick={clickHandler}
          onKeyPress={clickHandler}
          className={closeButton}
          aria-label={'Close glossary'}
          ref={glossaryRef}
          data-testid={'glossaryCloseButton'}
        >
          <FontAwesomeIcon icon={faXmark as IconProp} className={closeIcon} />
        </button>
      </div>
      <SearchBar
        onChange={onSearchBarChange}
        width={282}
        filter={filter}
        label="Search the glossary"
      />
    </div>
  )
}

export default GlossaryHeader;
