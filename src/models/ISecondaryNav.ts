import { ReactElement } from "react";
import { ISecondaryNavSection } from "./ISecondaryNavSection";

export interface ISecondaryNav {
  sections: ISecondaryNavSection[],
  activeClass: string,
  hoverClass?: string,
  linkClass?: string,
  analytics?: boolean,
  analyticsCategory?: string,
  analyticsPageLabel?: string,
  width?: number,
  headerComponent?: ReactElement,
  tocScrollOffset?: number
}
