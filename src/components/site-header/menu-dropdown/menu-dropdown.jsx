import {
  activeDropdownLink,
  caret,
  dropdown,
  dropdownButton,
  dropdownButtonExpanded,
  dropdownColumnOne,
  dropdownContent,
  dropdownHidden,
  dropdownListItem,
  dropdownRow,
  dropdownTitle,
  resourceLink,
  resourcesDropDown,
} from './menu-dropdown.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight';
import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';
import Analytics from '../../../utils/analytics/analytics';
import CustomLink from '../../links/custom-link/custom-link';

const MenuDropdown = ({ content, activeDropdown, setActiveDropdown, glossaryClickHandler, analyticsClickHandler }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isExpanded, setExpanded] = useState(false);

  const title = content.title;
  const getMinWidth = link => ({
    minWidth: `${link.length * 7.5 + 28}px`,
  });

  const handlePageClick = (title, pageName) => {
    window.dataLayer = window.dataLayer || [];
    if (title === 'Topics') {
      Analytics.event({
        category: 'Sitewide Navigation',
        action: `Topics Click`,
        label: pageName,
      });
      window.dataLayer.push({
        event: 'topics-click',
        eventLabel: pageName,
      });
    } else if (pageName === 'Glossary') {
      glossaryClickHandler(true);
      window.dataLayer.push({ event: 'glossary-click' });
    } else if (pageName === 'API Documentation') {
      analyticsClickHandler(pageName);
      window.dataLayer.push({
        event: 'api-doc-click-resources',
        eventLabel: document.title,
      });
    } else if (pageName === 'Release Calendar') {
      window.dataLayer.push({
        event: 'Release Calendar-click',
        eventLabel: document.title,
      });
    } else if (title === 'Tools') {
      window.dataLayer.push({
        event: 'tools-click',
        eventLabel: pageName,
      });
    } else {
      Analytics.event({
        category: 'Sitewide Navigation',
        action: `${pageName} Click`,
        label: pageName,
      });
    }
  };

  const handleMouseLeave = () => setActiveDropdown(null);

  const handleMouseEnter = () => {
    setTimeout(() => {
      setExpanded(true);
      setActiveDropdown(title);
      setToggleDropdown(true);
      setTimeout(() => setToggleDropdown(false), 10);
    }, 20);
  };

  const handleBlur = event => {
    const currentTarget = event.currentTarget;
    requestAnimationFrame(() => {
      if (!currentTarget.contains(document.activeElement)) {
        handleMouseLeave();
      }
    });
  };

  useEffect(() => {
    if (activeDropdown !== title) {
      setExpanded(false);
      setToggleDropdown(true);
      setTimeout(() => setToggleDropdown(false), 10);
    }
  }, [activeDropdown, title]);

  const childLayout = () => {
    if (content.children[0].children) {
      return content.children.map((section, index) => (
        <div className={dropdownRow} key={index}>
          <div className={dropdownColumnOne}>
            <div className={dropdownTitle}>{section.header}</div>
            <div>
              {section.children.map(page => (
                <div key={page.title} className={dropdownListItem}>
                  <Link
                    to={page.to}
                    activeClassName={activeDropdownLink}
                    onClick={() => handlePageClick(title, page.title)}
                    style={getMinWidth(page.title)}
                  >
                    {page.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      ));
    }

    return (
      <div className={resourcesDropDown}>
        {content.children.map(link => {
          if (link.external) {
            return (
              <div key={link.title} className={dropdownListItem} style={getMinWidth(link.title)}>
                <CustomLink
                  url={link.to}
                  external
                  skipExternalModal={link.skipExternalModal}
                  onClick={() => handlePageClick(title, link.title)}
                  data-testid={`${link.title.toLowerCase().replace(/\s+/g, '-')}-link`}
                  className={resourceLink}
                >
                  {link.title}
                </CustomLink>
              </div>
            );
          }

          if (link.to) {
            return (
              <div key={link.title} className={dropdownListItem} style={getMinWidth(link.title)}>
                <Link to={link.to} activeClassName={activeDropdownLink} onClick={() => handlePageClick(title, link.title)}>
                  {link.title}
                </Link>
              </div>
            );
          }

          return (
            <button key={link.title} onClick={() => handlePageClick(title, link.title)} style={{ minWidth: `${link.title.length * 7.5 + 28}px` }}>
              {link.title}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={dropdown}>
      <div
        className={`${isExpanded ? dropdownButtonExpanded : ''} ${dropdownButton}`}
        style={{ minWidth: `${title.length * 7.5 + 29}px` }}
        aria-label={`Page links for ${title}`}
        aria-expanded={isExpanded}
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        role="button"
        tabIndex={0}
      >
        {title}
        <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} className={caret} />
      </div>

      {isExpanded && (
        <div
          className={`${dropdownContent} ${toggleDropdown ? dropdownHidden : ''}`}
          data-testid="dropdownContent"
          onMouseLeave={handleMouseLeave}
          onBlur={handleBlur}
          role="presentation"
        >
          {childLayout()}
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
