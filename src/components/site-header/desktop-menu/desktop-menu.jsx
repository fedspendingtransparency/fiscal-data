import React from 'react';
import { Link } from 'gatsby';
import Experimental from '../../experimental/experimental';
import MenuDropdown from '../menu-dropdown/menu-dropdown';
import { menuSections } from '../site-header-helper';
import { pageLinks, pageLinkButtonContainer, pageLinkButton, activeLink, pageLinkButtonActive } from './desktop-menu.module.scss';

const DesktopMenu = ({ location, glossaryClickHandler, clickHandler, activeDropdown, setActiveDropdown, buttonHeight }) => {
  return (
    <nav className={pageLinks} data-testid="pageLinks" style={{ height: buttonHeight + 'px' }}>
      {menuSections.map((pageLink, index) => {
        if (pageLink.isExperimental) {
          return (
            <Experimental featureId={pageLink.featureId} key={pageLink.title}>
              <div className={pageLinkButtonContainer} style={{ minWidth: `${pageLink.title.length * 8 + 16}px` }}>
                <div className={pageLinkButton} role={'presentation'}>
                  <Link to={pageLink.to} activeClassName={activeLink} data-testid={pageLink.testId}>
                    {pageLink.title}
                  </Link>
                </div>
              </div>
            </Experimental>
          );
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
              buttonHeight={buttonHeight - 2}
            />
          );
        }

        return (
          <div className={pageLinkButtonContainer} style={{ minWidth: `${pageLink.title.length * 7.5 + 16}px` }} key={pageLink.title} tabIndex={-1}>
            {pageLink.to === location?.pathname ? (
              <div className={`${pageLinkButton} ${pageLinkButtonActive}`}>
                <span>{pageLink.title}</span>
              </div>
            ) : (
              <div role="presentation" className={pageLinkButton} onMouseEnter={() => setActiveDropdown(pageLink.title)}>
                <Link
                  key={pageLink.title}
                  to={pageLink.to}
                  activeClassName={activeLink}
                  data-testid={pageLink.testId}
                  onClick={() => clickHandler(pageLink.title)}
                >
                  {pageLink.title}
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default DesktopMenu;
