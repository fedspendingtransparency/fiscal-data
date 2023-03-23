import {
  dropdown,
  dropdownButton,
  dropdownButtonExpanded,
  dropdownContent,
  caret,
  dropdownHidden
}from "./menu-dropdown.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const MenuDropdown = (
  {title, handleMouseOver, toggled, isExpanded, handleMouseLeave, handleBlur, menuExpanding, children}) => {

  return(
    <div
      className={dropdown}
         style={{transition:'opacity 1s ease'}}
         key={title}
    >
      <button
        className={`${toggled ? dropdownButtonExpanded : null} ${dropdownButton}`}
        onMouseEnter={handleMouseOver}
        onFocus={handleMouseOver}
        data-testid={'topicsButton'}
        style={{minWidth:`${(title.length * 7.5)+28}px`}}
      >
        {title}
        <FontAwesomeIcon icon={toggled ? faCaretDown : faCaretRight} className={caret} />

      </button>
      {isExpanded && (
        <div
          className={`${dropdownContent} ${menuExpanding ? dropdownHidden : ''}`}
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
