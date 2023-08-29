import React from 'react';
import { Link } from 'gatsby';
import Experimental from '../../experimental/experimental';
import MenuDropdown from '../menu-dropdown/menu-dropdown';
import { menuSections } from '../site-header-helper';
import {
  pageLinks,
  pageLinkButtonContainer,
  pageLinkButtonContent,
  pageLinkButton,
  activeLink,
  pageLinkButtonActive,
} from './desktop-menu.module.scss';

const DesktopMenu = ({ location, glossaryClickHandler, clickHandler, activeDropdown,  setActiveDropdown }) => {


  return (
    <div className={pageLinks} data-testid="pageLinks">
      {menuSections.map((pageLink, index) => {
        if (pageLink.isExperimental) {
          return (
            <Experimental featureId={pageLink.featureId} key={pageLink.title}>
              <div className={pageLinkButtonContainer}>
                <div className={pageLinkButtonContent}
                     style={{minWidth: `${(pageLink.title.length * 8) + 16}px`}}
                >
                  <button className={pageLinkButton}>
                    <Link
                      to={pageLink.to}
                      activeClassName={activeLink}
                      data-testid={pageLink.testId}
                    >
                      {pageLink.title}
                    </Link>
                  </button>
                </div>
              </div>
            </Experimental>
          )
        }

        if (pageLink.children) {
          return (
            <MenuDropdown
              content={pageLink}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              glossaryClickHandler={glossaryClickHandler}
              key={index}
              analyticsClickHandler={clickHandler}
            />
          )
        }

        return (
          <div className={pageLinkButtonContainer} key={pageLink.title}>
            <div className={pageLinkButtonContent}
                 style={{minWidth: `${(pageLink.title.length * 7.5) + 16}px`}}
            >
              {pageLink.to === location?.pathname ?
                <button
                  className={`${pageLinkButton} ${pageLinkButtonActive}`}
                  disabled
                >
                  <span>
                    {pageLink.title}
                  </span>
                </button> : (
                  <button
                    className={pageLinkButton}
                    onMouseEnter={() => setActiveDropdown(pageLink.title)}
                  >
                    <Link
                      key={pageLink.title}
                      to={pageLink.to}
                      activeClassName={activeLink}
                      data-testid={pageLink.testId}
                      onClick={() => clickHandler(pageLink.title)}
                    >
                      {pageLink.title}
                    </Link>
                  </button>
                )
              }
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default DesktopMenu;
