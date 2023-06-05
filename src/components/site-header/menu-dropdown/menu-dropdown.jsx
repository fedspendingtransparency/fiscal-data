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
    activeDropdown,
    setActiveDropdown,
  }) => {

  const [hideDropdown, setHideDropdown] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const title = object.title;

  useEffect(() => {
    setHideDropdown(true);
    // console.log("Title: " + title)
    // console.log("Active dropdown: " + activeDropdown)

    if (activeDropdown === title) {
      setExpanded(true);
    } else if (activeDropdown) {
      // setExpanded(false);
      // handleMouseLeave()
    }

    setTimeout(() => {
      setHideDropdown(false)
        }, 10)
  }, [activeDropdown])


  const handleMouseLeave = () => {
    console.log("mouse leave activited")

    setHideDropdown(true);
    if (activeDropdown && activeDropdown !== title) {
      setExpanded(false)
    }
    setTimeout(() => {
      setExpanded(false);
    }, 500)

    if (activeDropdown === title) {
      setActiveDropdown(null);
    }
  }

  const clickHandler = (title) => {
    Analytics.event({
      category: 'Sitewide Navigation',
      action: `${title} Click`,
      label: title
    });
  }

  const handleBlur = (event) => {
    const currentTarget = event.currentTarget;
    requestAnimationFrame(() => {
      if(!currentTarget.contains(document.activeElement)) {
        handleMouseLeave();
      }
    });
  }


  const children = (object) => {
    if (object.children[0].children) {
      return object.children.map((section, index) =>{
        return (
          <div className={styles.dropdownRow} key={index}>
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
        className={`${isExpanded ? dropdownButtonExpanded : null} ${dropdownButton}`}
        onMouseEnter={handleMouseOver}
        onMouseLeave={() => handleMouseLeave()}
        onFocus={handleMouseOver}
        style={{minWidth:`${(title.length * 7.5)+28}px`}}
      >
        {title}
        <FontAwesomeIcon icon={activeDropdown === title ? faCaretDown : faCaretRight} className={caret} />

      </button>
      {isExpanded && (
        <div
          className={`${dropdownContent} ${hideDropdown ? dropdownHidden : ''}`}
          onMouseOver={() => handleMouseOver(title)}
          onMouseLeave={() => handleMouseLeave()}
          onFocus={handleMouseOver}
          onBlur={(e) => handleBlur(e)}
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
