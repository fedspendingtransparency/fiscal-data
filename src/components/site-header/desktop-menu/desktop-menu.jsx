import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'gatsby';
import Analytics from '../../../utils/analytics/analytics';
import CustomLink from '../../links/custom-link/custom-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import {
  nav,
  triggers,
  triggerBtn,
  triggerActive,
  indicator,
  viewport,
  viewportInner,
  panel,
  grid,
  item,
  itemIcon,
  itemTexts,
  itemTitle,
  itemDesc,
  groups,
  groupCol,
  groupTitle,
  groupList,
} from './desktop-menu.module.scss';

const CLAMP_PADDING = 16;
const OPEN_DELAY = 60;   // hover intent
const CLOSE_DELAY = 140; // forgiving close

const DesktopMenu = ({
                       location,
                       glossaryClickHandler,
                       clickHandler,            // existing handler you already have
                       analyticsClickHandler,   // optional (falls back to clickHandler)
                       buttonHeight,
                       menuSections,            // pass from SiteHeader or import inside here
                     }) => {
  const navRef = useRef(null);
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const indicatorRef = useRef(null);
  const triggerRefs = useRef([]);

  const safeSections = Array.isArray(menuSections) ? menuSections : [];
  const dropdownIndexes = useMemo(() => safeSections.map(s => !!s.children), [safeSections]);

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [viewportStyle, setViewportStyle] = useState({ left: 0, width: 560, height: 280, opacity: 0 });
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const timers = useRef({ open: 0, close: 0 });
  const clearTimers = () => {
    if (timers.current.open) clearTimeout(timers.current.open);
    if (timers.current.close) clearTimeout(timers.current.close);
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
  const isDropdown = idx => dropdownIndexes[idx];

  const positionIndicator = idx => {
    const el = triggerRefs.current[idx];
    if (!el || !navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setIndicatorStyle({ left: r.left - navRect.left, width: r.width });
  };

  const measurePanel = () => {
    const w = contentRef.current?.scrollWidth || 560;
    const h = contentRef.current?.scrollHeight || 280;
    const maxW = Math.min(760, window.innerWidth - CLAMP_PADDING * 2);
    return { width: clamp(w, 360, maxW), height: clamp(h, 160, 520) };
  };

  const positionViewport = idx => {
    const btn = triggerRefs.current[idx];
    if (!btn) return;
    const { width, height } = measurePanel();
    const b = btn.getBoundingClientRect();
    const centerX = b.left + b.width / 2 - width / 2;
    const left = clamp(centerX, CLAMP_PADDING, window.innerWidth - width - CLAMP_PADDING);
    setViewportStyle(s => ({ ...s, left, width, height, opacity: 1 }));
  };

  const openFor = idx => {
    if (!isDropdown(idx)) return;
    clearTimers();
    timers.current.open = setTimeout(() => {
      setActiveIdx(idx);
      setOpen(true);
      positionIndicator(idx);
      requestAnimationFrame(() => positionViewport(idx));
    }, OPEN_DELAY);
  };

  const closeSoon = () => {
    clearTimers();
    timers.current.close = setTimeout(() => {
      setOpen(false);
      setActiveIdx(-1);
      setViewportStyle(s => ({ ...s, opacity: 0 }));
    }, CLOSE_DELAY);
  };

  useEffect(() => {
    const onResize = () => {
      if (open && activeIdx > -1) {
        positionIndicator(activeIdx);
        positionViewport(activeIdx);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [open, activeIdx]);

  const isGrouped = section =>
    Array.isArray(section?.children) &&
    section.children.length > 0 &&
    Array.isArray(section.children[0]?.children);

  // mirrors your old handlePageClick logic, including dataLayer events
  const onNavItemClick = (sectionTitle, pageTitle) => {
    const fire = analyticsClickHandler || clickHandler;
    window.dataLayer = window.dataLayer || [];

    if (sectionTitle === 'Topics') {
      Analytics.event({ category: 'Sitewide Navigation', action: 'Topics Click', label: pageTitle });
      window.dataLayer.push({ event: 'topics-click', eventLabel: pageTitle });
      return;
    }
    if (pageTitle === 'Glossary') {
      glossaryClickHandler?.(true);
      window.dataLayer.push({ event: 'glossary-click' });
      return;
    }
    if (pageTitle === 'API Documentation') {
      fire?.(pageTitle);
      window.dataLayer.push({ event: 'api-doc-click-resources', eventLabel: document.title });
      return;
    }
    if (pageTitle === 'Release Calendar') {
      window.dataLayer.push({ event: 'Release Calendar-click', eventLabel: document.title });
      return;
    }
    if (sectionTitle === 'Tools') {
      window.dataLayer.push({ event: 'tools-click', eventLabel: pageTitle });
      return;
    }

    Analytics.event({ category: 'Sitewide Navigation', action: `${pageTitle} Click`, label: pageTitle });
  };

  const renderItem = (page, sectionTitle) => {
    const inner = (
      <>
        {page.icon && <FontAwesomeIcon icon={page.icon} className={itemIcon} />}
        <div className={itemTexts}>
          <div className={itemTitle}>{page.title}</div>
          {page.desc && <div className={itemDesc}>{page.desc}</div>}
        </div>
      </>
    );

    if (!page.to && page.title === 'Glossary') {
      return (
        <button key={page.title} className={item} onClick={() => onNavItemClick(sectionTitle, page.title)}>
          {inner}
        </button>
      );
    }

    if (page.external) {
      return (
        <CustomLink
          key={page.title}
          url={page.to}
          external
          skipExternalModal={page.skipExternalModal}
          className={item}
          onClick={() => onNavItemClick(sectionTitle, page.title)}
        >
          {inner}
        </CustomLink>
      );
    }

    return (
      <Link key={page.title} to={page.to} className={item} onClick={() => onNavItemClick(sectionTitle, page.title)}>
        {inner}
      </Link>
    );
  };

  const SectionPanel = ({ section }) => {
    if (!section?.children) return null;

    if (isGrouped(section)) {
      return (
        <div className={panel} ref={contentRef} role="menu" aria-label={`${section.title} menu`}>
          <div className={groups}>
            {section.children.map(group => (
              <div className={groupCol} key={group.header}>
                <div className={groupTitle}>{group.header}</div>
                <div className={groupList}>
                  {group.children.map(page => renderItem(page, section.title))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={panel} ref={contentRef} role="menu" aria-label={`${section.title} menu`}>
        <div className={grid}>{section.children.map(page => renderItem(page, section.title))}</div>
      </div>
    );
  };

  const onTriggerEnter = i => {
    positionIndicator(i);
    if (isDropdown(i)) openFor(i);
    else closeSoon();
  };

  const onTriggerClick = (i, title) => {
    if (isDropdown(i)) {
      if (open && activeIdx === i) closeSoon();
      else openFor(i);
    } else {
      clickHandler?.(title);
    }
  };

  return (
    <nav
      className={nav}
      ref={navRef}
      onMouseLeave={closeSoon}
      role='presentation'
      aria-label="Primary"
      style={{ height: buttonHeight + 'px' }}
    >
      <div className={triggers}>
        {safeSections.map((s, i) => {
          const isActive = i === activeIdx && open;
          const isCurrentPage = s.to && s.to === location?.pathname;

          if (s.children) {
            return (
              <div
                key={s.title}
                className={`${triggerBtn} ${isActive ? triggerActive : ''}`}
                ref={el => (triggerRefs.current[i] = el)}
                onMouseEnter={() => onTriggerEnter(i)}
                onFocus={() => onTriggerEnter(i)}
                onClick={() => onTriggerClick(i, s.title)}
                role="presentation"
                aria-expanded={isActive}
              >
                {s.title}
                <FontAwesomeIcon icon={faCaretDown} style={{ marginLeft: 8 }} />
              </div>
            );
          }

          return (
            <div
              key={s.title}
              className={triggerBtn}
              ref={el => (triggerRefs.current[i] = el)}
              onMouseEnter={() => onTriggerEnter(i)}
              onFocus={() => onTriggerEnter(i)}
              role='presentation'
            >
              <Link to={s.to} aria-current={isCurrentPage ? 'page' : undefined} onClick={() => clickHandler?.(s.title)}>
                {s.title}
              </Link>
            </div>
          );
        })}
        <div
          className={indicator}
          ref={indicatorRef}
          style={{ transform: `translateX(${indicatorStyle.left}px)`, width: indicatorStyle.width }}
        />
      </div>

      {/* Shared viewport that morphs under the active trigger */}
      <div
        className={viewport}
        ref={viewportRef}
        style={{
          // transform: `translateX(${viewportStyle.left}px)`,
          width: viewportStyle.width,
          height: viewportStyle.height,
          opacity: viewportStyle.opacity,
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className={viewportInner}>
          {open && activeIdx > -1 && <SectionPanel section={safeSections[activeIdx]} />}
        </div>
      </div>
    </nav>
  );
};

export default DesktopMenu;
