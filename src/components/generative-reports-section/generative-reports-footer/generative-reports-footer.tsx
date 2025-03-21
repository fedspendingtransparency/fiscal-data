import React, { FunctionComponent } from 'react';
import { generativeReportsFooter } from './generative-reports-footer.module.scss';
const GenerativeReportsFooter: FunctionComponent = ({ message }) => {
  return <div className={generativeReportsFooter}>{message || ''}</div>;
};

export default GenerativeReportsFooter;
