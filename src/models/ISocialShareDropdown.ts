import {ISocialShareCopy} from "./ISocialShareCopy";

export interface ISocialShareDropdown {
  copy: ISocialShareCopy;
  pageName: string;
  buttonClicked: boolean;
  width?: number;
}
