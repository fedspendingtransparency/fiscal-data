import { ISocialShareCopy } from './ISocialShareCopy';

export interface ISocialShareComponent {
  copy: ISocialShareCopy;
  emailSeparator?: string;
  pageName: string;
  width?: number;
  horizontal?: boolean;
  displayStyle?: string;
  clickEvent?: () => void;
  headerLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
