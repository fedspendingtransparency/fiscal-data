import React from 'react';

export const updateAddressPath = (id, location) => {
  if (id && typeof window !== 'undefined' && window.history && location) {
    const newPath = `#${id}`;
    const newHistoryUrl = `${location.pathname}${newPath}`;
    window.history.replaceState({updatedPath: newPath}, "", newHistoryUrl);
    return true;
  }
  return null;
};

export const removeAddressPathQuery = (location) => {
  if (typeof window !== 'undefined' && window.history && location && location.search) {
    const searchParam = location.search;
    if (searchParam !== null) {
      const href = location.href.toString().split(searchParam)[0];
      console.log(href);
      const newHistoryUrl = `${href}`;
      window.history.replaceState("", "", '/americas-finance-guide/');
    }
    return true;
  }
  return null;
};

export const GlossaryLink = ({to, children}) => {
  const onclick = (e) => {
    if (e.key === undefined || e.key === 'Enter') {
      e.stopPropagation();
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState("", "", to)
      }
    }
  }
  return (
    <>
      <div onClick={(e) => onclick(e)}
           onKeyPress={(e) => onclick(e)}
           role={'button'}
           tabIndex={0}
      >
        {children}
      </div>
    </>
  )
}
