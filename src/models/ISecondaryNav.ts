import { ReactElement } from "react";
import { ISecondaryNavSection } from "./ISecondaryNavSection";

export interface ISecondaryNav {
  sections: ISecondaryNavSection[],
  activeClass: string,
  hoverClass?: string,
  linkClass?: string,
  width?: number,
  headerComponent?: ReactElement
}
