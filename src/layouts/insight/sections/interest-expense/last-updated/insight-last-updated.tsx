import React, { FunctionComponent, useEffect, useState } from 'react';

import { lastUpdated } from '../../../insight.module.scss';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { format } from 'date-fns';
import { getDateWithoutTimeZoneAdjust } from '../../../../../utils/date-utils';

export const InsightLastUpdated: FunctionComponent<{ endpoint: string }> = ({ endpoint }) => {
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const getCurrentInterestExpData = async () => {
    return basicFetch(`${apiPrefix}${endpoint}`);
  };

  const getLastUpdatedDate = async () => {
    let formattedDate;
    await getCurrentInterestExpData().then(async res => {
      if (res?.data) {
        formattedDate = format(getDateWithoutTimeZoneAdjust(res.data[0].record_date), 'MMMM d, yyyy');
      }
    });
    return formattedDate;
  };

  useEffect(() => {
    if (endpoint) {
      getLastUpdatedDate().then(res => setLastUpdatedDate(res));
    }
  }, []);
  return <>{<span className={lastUpdated}>Last Updated: {lastUpdatedDate}</span>}</>;
};
