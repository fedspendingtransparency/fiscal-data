import React, { useState, ReactElement, useEffect } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';
import { format } from 'date-fns';
import { getDateWithoutTimeZoneAdjust } from '../../../../../utils/date-utils';

export const BodyCopy = (): ReactElement => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [slgsTotal, setSlgsTotal] = useState(null);

  useEffect(() => {
    basicFetch(
      `${apiPrefix}v1/accounting/od/slgs_securities?fields=record_date,record_calendar_month,record_calendar_day,record_calendar_year&sort=-record_date`
    ).then(res => {
      if (res.data) {
        const lastUpdatedDate = res.data[0].record_date;
        const formattedDate = format(getDateWithoutTimeZoneAdjust(res.data[0].record_date), 'MMMM d, yyyy');
        setLastUpdated(formattedDate);

        basicFetch(
          `${apiPrefix}v1/accounting/od/slgs_securities?fields=record_date,outstanding_0_3_mos_cnt,outstanding_0_3_mos_amt,outstanding_3_6_mos_cnt,outstanding_3_6_mos_amt,outstanding_6_mos_to_2_yrs_cnt,outstanding_6_mos_to_2_yrs_amt,outstanding_2_5_yrs_cnt,outstanding_2_5_yrs_amt,outstanding_5_10_yrs_cnt,outstanding_5_10_yrs_amt,outstanding_over_10_yrs_cnt,outstanding_over_10_yrs_amt,record_calendar_month,record_calendar_day,record_calendar_year&filter=record_date:eq:${lastUpdatedDate}&sort=-record_date`
        ).then(res => {
          if (res.data) {
            const slgsTotalSum =
              parseFloat(res.data[0]['outstanding_0_3_mos_amt']) +
              parseFloat(res.data[0]['outstanding_3_6_mos_amt']) +
              parseFloat(res.data[0]['outstanding_6_mos_to_2_yrs_amt']) +
              parseFloat(res.data[0]['outstanding_2_5_yrs_amt']) +
              parseFloat(res.data[0]['outstanding_5_10_yrs_amt']) +
              parseFloat(res.data[0]['outstanding_over_10_yrs_amt']);
            const slgsInBillions = Math.round(slgsTotalSum / 1000000000);
            setSlgsTotal(slgsInBillions);
          }
        });
      }
    });
  }, []);

  console.log(typeof lastUpdated);

  return (
    <div>
      State and Local Government Series (SLGS) are non-marketable securities that exist to help state and local governments meet their financing needs
      while remaining in accordance with Internal Revenue Service (IRS) law. For example, if a city issues municipal bonds to pay for a new elementary
      school, there may be a delay between when the funds are acquired through the bond sales and when the city must pay the bills to build the
      school. As a result, state and local governments will invest these funds. The IRS has strict guidelines about how state and local governments
      can invest these funds to ensure they're used properly. SLGS securities are an attractive option because they make it easier to comply with IRS
      regulations. SLGS also serve the federal government as a means of financing the federal debt, similar to other treasury securities. As of{' '}
      {lastUpdated}, there are ${slgsTotal} B outstanding SLGS securities, XX percent of the total public debt outstanding.
    </div>
  );
};

// three things I need to grab from SLGS api data:

// latest date
// SLGS total
// __ -number (and maybe calculation needed) of percent of total public debt outstanding
