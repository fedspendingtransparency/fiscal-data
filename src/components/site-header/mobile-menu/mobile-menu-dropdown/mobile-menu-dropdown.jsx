import React, { useState } from 'react';
import {
  sectionHeader,
  mainHeader,
  headerExpanded,
  caret,
  linkContainer
} from './mobile-menu-dropdown.module.scss'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretRight} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'gatsby';
import Analytics from '../../../../utils/analytics/analytics';


const MobileMenuDropdown = ({ header, sections, defaultOpen, setOpenGlossary, setActiveState }) => {
  const [isExpanded, setIsExpanded] = useState(defaultOpen);
  const clickHandler = (title, action) => {
    if (title === 'Glossary'){
      setOpenGlossary(true);
      setActiveState(false);
    }
    if(action){
      Analytics.event({
        category: 'Sitewide Navigation',
        action: action,
        label: title
      });
    }
  };

  const handleKeyPress = e => {
    if (e?.key && e.key !== "Enter") {
      return;
    }
    setIsExpanded(!isExpanded);
  }

  return (
    <>
      <div
        className={`${mainHeader} ${isExpanded ? headerExpanded : null}`}
        onClick={() => {setIsExpanded(!isExpanded);}}
        onKeyPress={(e) => handleKeyPress(e)}
        role={'button'}
        tabIndex={0}
      >
        {header}
        <FontAwesomeIcon
          icon={isExpanded ? faCaretDown : faCaretRight}
          className={caret}
        />
      </div>
      <div hidden={!isExpanded}>
        {sections.map((section) => {
          return(
            <div data-testid={'expandedContent'} key={`${header}-${section.sectionHeader}`}>
              { section.sectionHeader &&
                <div className={sectionHeader}>
                  {section.sectionHeader}
                </div>
              }
              <div className={linkContainer}>
                {section.children.map((page) => {
                  if(page.name === 'Glossary'){
                    return(
                      <div>
                        <button onClick={() => clickHandler(page.name)}>
                          <div>{page.name}</div>
                        </button>
                      </div>
                      )
                  }
                  else {
                    return(
                      <Link
                        to={page.to}
                        onClick={() => clickHandler(page.name, section.analyticsAction)}
                        key={page.name}
                      >
                        {page.name}
                      </Link>
                      )
                  }
                  
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default MobileMenuDropdown;
