import {ISocialShareCopy} from "./ISocialShareCopy";

export interface ISocialShareComponent {
  copy: ISocialShareCopy,
  emailSeparator?: string,

  pageName: string,
  width?: number,
  horizontal?: boolean,
  displayStyle?: string,
  clickEvent?: () => void,
}
