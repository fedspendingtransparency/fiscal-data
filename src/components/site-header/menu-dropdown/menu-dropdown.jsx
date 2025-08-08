import React from 'react';
import { Link } from 'gatsby';
import CustomLink from '../../links/custom-link/custom-link';
import {
  panel, panelHidden, sectionCol, sectionHeader, itemRow,
  itemTitle, itemDesc, iconWrap } from './menu-dropdown.module.scss';

import {
  faBook, faCode, faCalendar, faUsers, faPiggyBank, faPercent,
  faBuildingColumns, faArrowsLeftRight, faMinus, faChartPie, faCompass, faLandmark } from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  book: faBook,
  code: faCode,
  calendar: faCalendar,
  users: faUsers,
  piggy: faPiggyBank,
  percent: faPercent,
  building: faBuildingColumns,
  arrows: faArrowsLeftRight,
  minus: faMinus,
  chartPie: faChartPie,
  compass: faCompass,
  bank: faLandmark,
  coins: faPiggyBank,
};


const NavDropdownPanel = ({ visible, content, style, onRequestClose, glossaryClickHandler, onAnalytics }) => {
  if (!content) return null;

  const handleClick = (sectionTitle, page) => {
    if (page.title === 'Glossary') glossaryClickHandler(true);
    if (onAnalytics) onAnalytics(sectionTitle);
    onRequestClose();
  };

  const renderItem = (sectionTitle, page) => {
    const Icon = page?.icon && iconMap[page.icon] ? iconMap[page.icon] : null;
    const label = (
      <div className={itemRow} style={{ minWidth: `${page.title.length * 7.5 + 28}px` }}>
        {Icon ? <span className={iconWrap}><FontAwesomeIcon icon={Icon} /></span> : null}
        <div>
          <div className={itemTitle} style={page?.color ? {color: page.color} : undefined}>{page?.title}</div>
          {page?.desc ? <div className={itemDesc}>{page.desc}</div> : null}
        </div>
      </div>
    );

    if (page.external) {
      return (
        <CustomLink
          key={page.title}
          url={page.to}
          external
          skipExternalModal={page.skipExternalModal}
          onClick={() => handleClick(content.title, page)}
        >
          {label}
        </CustomLink>
      );
    }

    if (page.to) {
      return (
        <Link key={page.title} to={page.to} onClick={() => handleClick(content.title, page)}>
          {label}
        </Link>
      );
    }

    return (
      <button key={page.title} onClick={() => handleClick(content.title, page)}>
        {label}
      </button>
    );
  };

  const groups = Array.isArray(content.children) ? (content.children[0]?.children ?  content.children : [{ header: null, children: content.children }]) :[];

  return (
    <div
      className={`${panel} ${visible ? '' : panelHidden}`}
      style={style}
      onMouseLeave={onRequestClose}
      role="presentation"
      aria-label={`Page links for ${content.title}`}
    >

      {groups?.map((section, idx) => (
        <div className={sectionCol} key={idx}>
          {section.header ? <div className={sectionHeader}>{section.header}</div> : null}
          {section.children?.map(page => renderItem(content.title, page))}
        </div>
      ))}
    </div>
  );
};

export default NavDropdownPanel;

