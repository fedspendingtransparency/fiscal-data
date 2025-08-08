
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby'; import Experimental from '../../experimental/experimental';
import { menuSections } from '../site-header-helper';
import {
  pageLinks, pageLinkButtonContainer, pageLinkButton,
  activeLink, pageLinkButtonActive
} from './../menu-dropdown/menu-dropdown.module.scss';
import NavDropdownPanel from '../menu-dropdown/menu-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const DesktopMenu = ({ location, glossaryClickHandler, clickHandler, buttonHeight }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [panelContent, setPanelContent] = useState(null);
  const [panelStyle, setPanelStyle] = useState({ opacity: 0 });
  const triggersRef = useRef([]);

  const positionPanel = (idx) => {
    const el = triggersRef.current[idx];
    const container = el?.closest('[data-nav-root]');
    if (!el || !container) return;

    const trig = el.getBoundingClientRect();
    const cont = container.getBoundingClientRect();
    const panelWidth = Math.min(920, cont.width - 24);
    const desiredLeft = trig.left - cont.left + (trig.width / 2) - (panelWidth / 2);

    const left = clamp(desiredLeft, 12, cont.width - panelWidth - 12);

    setPanelStyle(s => ({
      ...s,
      width: `${600}px`,
      transform: `translateX(${left}px)`,
      opacity: 1,
    }));
  };

  const openDropdown = (idx) => {
    const section = menuSections[idx];
    if (!section?.children) return;
    setActiveIndex(idx);
    setPanelContent(section);

    requestAnimationFrame(() => positionPanel(idx));
  };

  const closeDropdown = () => {
    setPanelStyle(s => ({ ...s, opacity: 0 }));
    setActiveIndex(null);
    setPanelContent(null);
  };

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') closeDropdown(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <div className={pageLinks} data-testid="pageLinks" style={{ height: buttonHeight + 'px' }} data-nav-root onMouseLeave={closeDropdown} role='presentation'>
      {menuSections.map((item, index) => {
        const isActiveRoute = item.to  === location?.pathname;
        const hasDropdown = !!item.children;

        const trigger = (
          <div
            className={pageLinkButtonContainer}
            style={{ minWidth: `${item.title.length * 7.5 + 16}px` }}
            key={item.title}
            ref={(el) => (triggersRef.current[index] = el)}
            onMouseEnter={() => hasDropdown ? openDropdown(index) : closeDropdown()}
            onFocus={() => hasDropdown ? openDropdown(index) : closeDropdown()}
            role={'presentation'}
          >
            {item.isExperimental ? (
              <Experimental featureId={item.featureId}>
                <button className={pageLinkButton}>
                  <Link to={item.to} activeClassName={activeLink} data-testid={item.testId}>{item.title}</Link>
                </button>
              </Experimental>
            ) : hasDropdown ? (
              <button className={pageLinkButton} aria-haspopup="true" aria-expanded={activeIndex === index}>
                <span>{item.title}</span>
                <FontAwesomeIcon icon={faCaretDown} />
              </button>
            ) : isActiveRoute ? (
              <div className={`${pageLinkButton} ${pageLinkButtonActive}`}><span>{item.title}</span></div>
            ) : (
              <div className={pageLinkButton}>
                <Link
                  to={item.to}
                  activeClassName={activeLink}
                  data-testid={item.testId}
                  onClick={() => clickHandler(item.title)}
                >
                  {item.title}
                </Link>
              </div>
            )}
          </div>
        );

        return trigger;
      })}

      <NavDropdownPanel
        visible={!!panelContent}
        content={panelContent}
        style={panelStyle}
        onRequestClose={closeDropdown}
        glossaryClickHandler={glossaryClickHandler}
        onAnalytics={clickHandler}
      />
    </div>
  );
};

export default DesktopMenu;

