/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import * as styles from './mobile-menu.module.scss';
import { Link } from "gatsby";
import MenuButton from "../menu-button/menu-button";
import MobileMenuDropdown from "./mobile-menu-dropdown/mobile-menu-dropdown";

const MobileMenu = ({ setOpenGlossary }) => {
  const [activeState, setActiveState] = useState(false);

  const toggleState = (e) => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  }

  const topics = [
    {
      sectionHeader: 'AMERICA\'S FINANCE GUIDE',
      analyticsAction: 'Topics Click',
      children: [
        {
          to: '/americas-finance-guide/',
          name: 'Overview'
        },
        {
          to: '/americas-finance-guide/government-revenue/',
          name: 'Revenue'
        },
        {
          to: '/americas-finance-guide/federal-spending/',
          name: 'Spending'
        },
        {
          to: '/americas-finance-guide/national-deficit/',
          name: 'Deficit'
        },
        {
          to: '/americas-finance-guide/national-debt/',
          name: 'Debt'
        }
      ]
    }
  ]

  const tools = [
    {
      children: [
        {
          to: '/currency-exchange-rates-converter/',
          name: 'Currency Exchange Rates Converter'
        }
      ]
    }
  ]

  const resources = [
    {
      children: [
        {
          to: '/',
          name: 'Glossary'
        },
        {
          to: '/api-documentation/',
          name: 'API Documentation'
        },
        {
          to: '/release-calendar/',
          name: 'Release Calendar'
        },
      ]
    }
  ]
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
            <MobileMenuDropdown header={'Topics'} sections={topics} defaultOpen />
            <MobileMenuDropdown header={'Tools'} sections={tools} />
            <Link to="/datasets/" className={styles.pageLinks}>
              Dataset Search
            </Link>
            <MobileMenuDropdown header={'Resources'} 
                                sections={resources} 
                                setOpenGlossary={setOpenGlossary} 
                                setActiveState={setActiveState} />
            <Link to="/about-us/" className={styles.pageLinks}>
              About Us
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default MobileMenu;
