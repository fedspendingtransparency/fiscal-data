import {ISocialShareCopy} from "./ISocialShareCopy";

export interface ISocialShareComponent {
  copy: ISocialShareCopy,
  emailSeparator?: string,

  pageName: string,
  width?: number,
  horizontal?: boolean,
  buttonClick?: boolean,
  displayStyle?: string,
  customHandleButtonClick?: any,
}
