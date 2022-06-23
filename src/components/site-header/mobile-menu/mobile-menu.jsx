/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import * as styles from './mobile-menu.module.scss';
import { Link } from "gatsby";
import MenuButton from "../menu-button/menu-button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";
import Experimental from "../../experimental/experimental";

const MobileMenu = () => {
  const [activeState, setActiveState] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }

  const dropdownTempText = 'Coming soon! — Short analyses on '
    + 'federal finance topics';

  return (
    <div
      className={`${styles.menuContainer} ${activeState ? styles.open : ''}`}
      data-testid="menuContainer"
    >
      {/*
        * TODO: use some kind of onClickOutside event instead of having a clickable overlay.
        * A React hook is an easy way to handle this (ex. https://usehooks.com/useOnClickOutside/)
        */}
      <div
        className={styles.overlay}
        data-testid="overlay"
        onClick={toggleState}
      />
      <div className={`${styles.tray} ${activeState ? styles.open : ''}`}>
        {!activeState && (
          <MenuButton clickHandler={toggleState} isOpen={activeState} />
        )}
          {activeState && (
            <>
              <div className={styles.linkHeaderContainer}>
                <Link to="/" data-testid="logo">
                  <img
                    src="/logos/fd-logo-mobile.svg"
                    alt="Fiscal Data logo"
                    className={styles.logo}
                  />
                </Link>
                <MenuButton clickHandler={toggleState} isOpen={activeState} />
              </div>
              <div>
                <Experimental featureId={'topics'}>
                  <div className={isExpanded ? styles.topicsHeaderExpanded : styles.topicsHeader}
                       onClick={() => {setIsExpanded(!isExpanded)}}
                  >
                    Topics
                    {isExpanded
                      ? <FontAwesomeIcon icon={faCaretDown} className={styles.caret} />
                      : <FontAwesomeIcon icon={faCaretRight} className={styles.caret} />
                    }
                  </div>
                  {isExpanded && (
                    <div data-testid={'expandedContent'}>
                      <div className={styles.AFGHeader}>
                        AMERICA'S FINANCE GUIDE
                      </div>
                      <div className={styles.debtLinkContainer}>
                        <Link to="/national-debt/" className={styles.debtLink}>Debt</Link>
                      </div>
                      <div className={styles.AFGHeader}>
                        INSIGHTS
                      </div>
                      <div className={styles.dropdownTempText}>
                        <em>{dropdownTempText}</em>
                      </div>
                    </div>
                  )}
                </Experimental>
              </div>
              <div className={styles.pageLinks}>
                <Link to="/datasets/" data-testid="datasets">Dataset Search</Link>
                <Link to="/api-documentation/" data-testid="apiDocs">API Documentation</Link>
                <Link to="/about-us/" data-testid="about">About Us</Link>
              </div>
            </>
          )}
      </div>
    </div>
  );
};
export default MobileMenu;
