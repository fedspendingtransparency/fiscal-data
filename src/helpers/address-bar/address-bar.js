
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
      const newHistoryUrl = `${location.pathname}`;
      window.history.replaceState('', '', newHistoryUrl);
    }
    return true;
  }
  return null;
};

