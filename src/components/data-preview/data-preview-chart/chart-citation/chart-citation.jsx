import React from 'react';
import { format } from 'date-fns';
import globalConstants from '../../../../helpers/constants';
import { outerContainer, title, container, text } from './chart-citation.module.scss';
import CustomLink from '../../../links/custom-link/custom-link';

export const chartCitationTitle = 'Suggested Citation:';
export const chartCitationText = ', retrieved from Fiscal Data';

const ChartCitation = ({ currentTableName, slug }) => {
  const today = `, ${format(new Date(), 'PP')}`;
  const fullUrl = `${globalConstants.BASE_SITE_URL}/datasets${slug}`;

  return (
    <div className={outerContainer}>
      <div className={title}>{chartCitationTitle}</div>
      <div className={container}>
        <div className={text}>
          {currentTableName}
          {chartCitationText}
        </div>
        <div className={text}>
          <CustomLink url={fullUrl}>{fullUrl}</CustomLink>
          {today}
        </div>
      </div>
    </div>
  );
};

export default ChartCitation;
