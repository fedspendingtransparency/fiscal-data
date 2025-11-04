/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

import React, { useState } from 'react';
import { Link } from 'gatsby';
import MenuButton from '../menu-button/menu-button';
import MobileMenuDropdown from './mobile-menu-dropdown/mobile-menu-dropdown';
import { bottomMostLink, linkHeaderContainer, logo, menuContainer, open, overlay, pageLinks, tray } from './mobile-menu.module.scss';

const MobileMenu = ({ setOpenGlossary }) => {
  const [activeState, setActiveState] = useState(false);

  const toggleState = e => {
    if (!e.key || e.key === 'Enter') {
      setActiveState(!activeState);
    }
  };

  const clickHandler = action => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: `${action}-click`,
      eventLabel: document.title,
    });
  };

  const topics = [
    {
      sectionHeader: 'FEATURED TOPICS',
      analyticsAction: 'Topics Click',
      children: [
        {
          to: '/interest-expense-avg-interest-rates/',
          name: 'Interest Expense',
        },
        {
          to: '/treasury-savings-bonds/',
          name: 'Savings Bonds',
        },
        {
          to: '/state-and-local-government-series/',
          name: 'State and Local Government Series',
        },
      ],
    },
    {
      sectionHeader: "AMERICA'S FINANCE GUIDE",
      analyticsAction: 'Topics Click',
      children: [
        {
          to: '/americas-finance-guide/',
          name: 'Overview',
        },
        {
          to: '/americas-finance-guide/government-revenue/',
          name: 'Revenue',
        },
        {
          to: '/americas-finance-guide/federal-spending/',
          name: 'Spending',
        },
        {
          to: '/americas-finance-guide/national-deficit/',
          name: 'Deficit',
        },
        {
          to: '/americas-finance-guide/national-debt/',
          name: 'Debt',
        },
      ],
    },
  ];

  const tools = [
    {
      analyticsAction: 'Tools Click',
      children: [
        {
          to: '/currency-exchange-rates-converter/',
          name: 'Currency Exchange Rates Converter',
        },
      ],
    },
  ];

  const resources = [
    {
      children: [
        {
          to: '/',
          name: 'Glossary',
        },
        {
          to: '/api-documentation/',
          name: 'API Documentation',
        },
        {
          to: '/release-calendar/',
          name: 'Release Calendar',
        },
        {
          to: 'https://onevoicecrm.my.site.com/FiscalDataCommunity/s/',
          name: 'Community Site',
          external: true,
          skipExternalModal: true,
        },
      ],
    },
  ];
  return (
    <div className={`${menuContainer} ${activeState ? open : ''}`} data-testid="menuContainer">
      {/*
       * TODO: use some kind of onClickOutside event instead of having a clickable overlay.
       * A React hook is an easy way to handle this (ex. https://usehooks.com/useOnClickOutside/)
       */}
      <div className={overlay} data-testid="overlay" onClick={toggleState} />
      <nav className={`${tray} ${activeState ? open : ''}`}>
        {!activeState && <MenuButton clickHandler={toggleState} isOpen={activeState} />}
        {activeState && (
          <>
            <div className={linkHeaderContainer}>
              <Link to="/" data-testid="logo">
                <img src="/logos/fd-logo-mobile.svg" alt="Fiscal Data logo" className={logo} />
              </Link>
              <MenuButton clickHandler={toggleState} isOpen={activeState} />
            </div>
            <MobileMenuDropdown header="Topics" sections={topics} defaultOpen />
            <MobileMenuDropdown header="Tools" sections={tools} />
            <Link to="/datasets/" className={pageLinks} onClick={() => clickHandler('Dataset Search')}>
              Dataset Search
            </Link>
            <MobileMenuDropdown header="Resources" sections={resources} setOpenGlossary={setOpenGlossary} setActiveState={setActiveState} />
            <Link to="/about-us/" className={`${pageLinks} ${bottomMostLink}`} onClick={() => clickHandler('About')}>
              About Us
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
export default MobileMenu;
