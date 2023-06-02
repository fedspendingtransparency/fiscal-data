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
import React, {useEffect, useState} from "react";
import * as styles from "../site-header.module.scss";
import {Link} from "gatsby";
import Analytics from "../../../utils/analytics/analytics";

const MenuDropdown = (
  {
    object,
    handleMouseOver,
    toggled,
    handleBlur,
  }) => {

  const [expanding, setExpanding] = useState(false);
  const [isExpanded, setExpanded] = useState(null);

  useEffect(() => {
    // debugger
    setExpanding(true);
    setExpanded(toggled);
    setTimeout(() => {
      setExpanding(false)
        }, 10)
  }, [toggled])

  const handleMouseLeave = (title) => {
    if(title) {
      setExpanding(true);
      setTimeout(() => {
        setExpanded(toggled);
      }, 500)
    }
  }

  const title = object.title;

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `${title} Click`,
      label: title
    });
  }
// TODO: IS THE SUBSECTION HEADER BEING RENDERED MULTIPLE TIMES?
  const children = (object) => {
    if (object.children[0].children) {
      return object.children.map((section) =>{
        return (
          <div className={styles.dropdownRow}>
            <div className={styles.dropdownColumnOne}>
              <div className={styles.dropdownTitle}>
                {section.subsectionHeader}
              </div>
              <div>
                {section.children.map((children) => {
                  return (
                    <div key={children.title}
                         className={styles.dropdownListItem}
                    >
                      <Link
                        to={children.to}
                        activeClassName={styles.activeTopicLink}
                        onClick={() => clickHandler(object.title)}
                      >
                        {children.title}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })
    } else {
      const primaryChildren = object.children;
      return (
        <div className={styles.resourcesDropDown}>
          {primaryChildren.map((link) => {
            return (
              <Link
                to={link.to}
                activeClassName={styles.activeTopicLink}
                key={link.title}
                onClick={() => clickHandler(link.title)}
              >
                {link.title}
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
        className={`${toggled === title ? dropdownButtonExpanded : null} ${dropdownButton}`}
        onMouseEnter={handleMouseOver}
        onFocus={handleMouseOver}
        style={{minWidth:`${(title.length * 7.5)+28}px`}}
      >
        {title}
        <FontAwesomeIcon icon={toggled === title ? faCaretDown : faCaretRight} className={caret} />

      </button>
      {isExpanded === title && (
        <div
          className={`${dropdownContent} ${expanding ? dropdownHidden : ''}`}
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
