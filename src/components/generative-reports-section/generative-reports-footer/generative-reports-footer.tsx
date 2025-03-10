import React, { FunctionComponent } from 'react';
import { generativeReportsFooter, footerMessageLabel, footerEmphasis } from './generative-reports-footer.module.scss';
const GenerativeReportsFooter: FunctionComponent = ({ message }) => {
  const defaultMessage = (
    <>
      <span className={footerMessageLabel}>Note: </span>
      <span>Daily Treasury Statement reports dated </span>
      <span className={footerEmphasis}>before </span>
      <span>FY 1998 are grouped by fiscal year. Once inside the desired year, scroll to the specific month and day.</span>
    </>
  );

  return <div className={generativeReportsFooter}>{message || defaultMessage}</div>;
};

export default GenerativeReportsFooter;
