import {getComputedStyle} from "../helpers/styles-helper/styles-helper";

export const currentFontSize =
  typeof window !== "undefined" ?
    Number(getComputedStyle('font-size') !== ""
      ? getComputedStyle('font-size').replace(/px/g, '') : 16)
    : 16;
