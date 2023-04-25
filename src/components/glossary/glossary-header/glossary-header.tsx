import React from 'react';
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
  closeIcon
} from './glossary-header.module.scss'
const GlossaryHeader = ({clickHandler}) => {


  return (
    <div className={headerContainer}>
      <div className={header}>
        <div className={title}>
          <FontAwesomeIcon icon={faBook as IconProp} className={bookIcon} />
          GLOSSARY
        </div>
        <button onClick={clickHandler}>
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
