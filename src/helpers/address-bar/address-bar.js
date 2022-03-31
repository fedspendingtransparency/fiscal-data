export const updateAddressPath = (id, location) => {
  if (id && typeof window !== 'undefined' && window.history && location) {
    const newPath = `#${id}`;
    const newHistoryUrl = `${location.pathname}${newPath}`;
    window.history.replaceState({updatedPath: newPath}, "", newHistoryUrl);
    return true;
  }
  return null;
};
