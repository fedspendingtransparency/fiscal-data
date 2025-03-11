import React, { FunctionComponent } from 'react';
import { generativeReportsFooter, footerMessageLabel, footerEmphasis } from './generative-reports-footer.module.scss';
const GenerativeReportsFooter: FunctionComponent = ({ message }) => {
  return <div className={generativeReportsFooter}>{message || ''}</div>;
};

export default GenerativeReportsFooter;
