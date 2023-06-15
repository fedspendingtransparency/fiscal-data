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
    content,
    handleMouseOver,
    activeDropdown,
    setActiveDropdown,
  }) => {

  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const title = content.title;

  const handleMouseLeave = () => {
    setActiveDropdown(null)
  }

  const handleMouseEnter = () => {
    setExpanded(true);
    setActiveDropdown(title);
    handleMouseOver(title);
    setToggleDropdown(true);
    setTimeout(() => {
      setToggleDropdown(false)
    }, 10)
  }

  useEffect(() => {
    if(activeDropdown !== title) {
      setExpanded(false);
      setToggleDropdown(true);
      setTimeout(() => {
        setToggleDropdown(false);
      }, 10)
    }
  }, [activeDropdown])

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

  const childLayout = () => {
    if (content.children[0].children) {
      return content.children.map((section, index) =>{
        return (
          <div className={styles.dropdownRow} key={index}>
            <div className={styles.dropdownColumnOne}>
              <div className={styles.dropdownTitle}>
                {section.header}
              </div>
              <div>
                {section.children.map((page) => {
                  return (
                    <div key={page.title}
                         className={styles.dropdownListItem}
                    >
                      <Link
                        to={page.to}
                        activeClassName={styles.activeTopicLink}
                        onClick={() => clickHandler(title)}
                      >
                        {page.title}
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
      const primaryChildren = content.children;
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
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      role={'button'}
      tabIndex={0}
    >
      <div
        className={`${isExpanded ? dropdownButtonExpanded : null} ${dropdownButton}`}
        style={{minWidth:`${(title.length * 7.5)+28}px`}}
      >
        {title}
        <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} className={caret} />
      </div>
      {isExpanded && (
        <div
          className={`${dropdownContent} ${toggleDropdown ? dropdownHidden : ''}`}
          data-testid={'dropdownContent'}
          onMouseLeave={handleMouseLeave}
          onBlur={(e) => handleBlur(e)}
          role={'presentation'}
        >
          {childLayout()}
        </div>
      )}
    </div>
  )
}

export default MenuDropdown;
