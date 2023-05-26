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
import * as styles from "../site-header.module.scss";
import {Link} from "gatsby";
import Analytics from "../../../utils/analytics/analytics";

const MenuDropdown = (
  {
    object,
    handleMouseOver,
    toggled,
    isExpanded,
    handleMouseLeave,
    handleBlur,
    menuExpanding,
  }) => {

  // pass in obj
  // place in title
  // check for child or grandchild obj/arr
    // if has dropdown and subsection => large submenu
    // if has dropdown and no subsection => regular submenu
  // return correct component

  const title = object.title;

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `${title} Click`,
      label: title
    });
  }

  const children = (object) => {
    if (object.children[0].children) {
      const subsectionHeader = object.children[0].subsectionHeader;
      const secondaryChildren = object.children[0].children;
      console.log('Topics');
      return (
        <div className={styles.dropdownRow}>
          <div className={styles.dropdownColumnOne}>
            <div className={styles.dropdownTitle}>
              {subsectionHeader}
            </div>
            <div>
              {secondaryChildren.map((children) => {
                return (
                  <div key={children.name}
                       className={styles.dropdownListItem}
                  >
                    <Link
                      to={children.to}
                      activeClassName={styles.activeTopicLink}
                      onClick={() => clickHandler(object.title)}
                    >
                      {children.name}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    } else {
      const primaryChildren = object.children;
      console.log('other')
      return (
        <div className={styles.resourcesDropDown}>
          {primaryChildren.map((link) => {
            return (
              <Link
                to={link.to}
                activeClassName={styles.activeTopicLink}
                key={link.name}
                onClick={() => clickHandler(link.name)}
              >
                {link.name}
              </Link>
            )
          })
          }
        </div>
      )
    }
  }

  return(
    <div
      className={dropdown}
      key={title}
    >
      <button
        className={`${toggled ? dropdownButtonExpanded : null} ${dropdownButton}`}
        onMouseEnter={handleMouseOver}
        onFocus={handleMouseOver}
        style={{minWidth:`${(title.length * 7.5)+28}px`}}
      >
        {title}
        <FontAwesomeIcon icon={toggled ? faCaretDown : faCaretRight} className={caret} />

      </button>
      {isExpanded && (
        <div
          className={`${dropdownContent} ${menuExpanding ? dropdownHidden : ''}`}
          onMouseOver={handleMouseOver}
          onMouseLeave={() => handleMouseLeave(title)}
          onFocus={handleMouseOver}
          onBlur={(e) => handleBlur(e, title)}
          role={'button'}
          tabIndex={'0'}
          data-testid={'dropdownContent'}
        >
          {children(object)}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown;
