// Transforms a CSS pixel value to a number for use in JS files
// If given a non-parseable string, it will return 0
export const pxToNumber = (pxValue) => parseInt(pxValue) || 0;

export const getComputedStyle = (style, selector = 'html') => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  const elem = document.querySelector(selector)
  const computedStyles = window.getComputedStyle(elem);
  return computedStyles.getPropertyValue(style) || "";
};
