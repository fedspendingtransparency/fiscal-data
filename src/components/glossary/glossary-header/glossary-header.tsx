import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  search,
  searchBar,
  headerContainer,
  title,
  bookIcon,
  searchIcon,
  header,
  closeIcon,
  closeButton
} from './glossary-header.module.scss'

interface IGlossaryHeader {
  clickHandler: (e) => void
}

const GlossaryHeader:FunctionComponent<IGlossaryHeader> = ({clickHandler}) => {


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
        Search the glossary
        <div className={searchBar}>
        </div>
      </div>
    </div>
  )
}

export default GlossaryHeader;
