import React, { useEffect, useState } from 'react';
import { ReactElement } from 'react';
import { lastUpdatedDate2 } from '../interest-expense';
import { getDateWithoutTimeZoneAdjust } from '../../../../../utils/date-utils';
import { format } from 'date-fns';
import { lastUpdated } from '../../../insight.module.scss';

export const LastUpdatedDate = (): ReactElement => {
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);

  useEffect(() => {
    const lastUpdated = async () => {
      const interestExpDate = await lastUpdatedDate2();
      const dated = getDateWithoutTimeZoneAdjust(interestExpDate);
      const currentFY = format(dated, 'MMMM d, yyyy');
      setLastUpdatedDate(currentFY);
    };
    lastUpdated();
  }, []);

  return <span className={lastUpdated}>Last Updated: {lastUpdatedDate}</span>;
};
