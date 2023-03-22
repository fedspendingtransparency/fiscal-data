import * as styles from "../site-header.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import React from "react";
// import {getMinWidth} from "../site-header";

const MenuDropdown = (
  {title, handleMouseOver, toggled, isExpanded, handleMouseLeave, handleBlur, menuExpanding, children}) => {

  return(
    <div
      className={styles.dropdown}
         style={{transition:'opacity 1s ease'}}
         key={title}
    >
      <button
        className={`${toggled ? styles.dropdownButtonExpanded : null} ${styles.dropdownButton}`}
        onMouseEnter={handleMouseOver}
        onFocus={handleMouseOver}
        data-testid={'topicsButton'}
        style={{minWidth:`${(title.length * 7.75)+38}px`}}
      >
        {title}
        <FontAwesomeIcon icon={toggled ? faCaretDown : faCaretRight} className={styles.caret} />

      </button>
      {isExpanded && (
        <div
          className={`${styles.dropdownContent} ${menuExpanding ? styles.dropdownHidden : ''}`}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseOver}
          onBlur={handleBlur}
          role={'button'}
          tabIndex={'0'}
          data-testid={'dropdownContent'}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown;
