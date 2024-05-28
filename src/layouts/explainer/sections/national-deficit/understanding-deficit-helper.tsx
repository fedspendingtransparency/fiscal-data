import React, { useEffect, useState } from 'react';

import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';

useEffect(() => {
  const fields = 'fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year';
  const sort = 'sort=record_date';
  const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&${sort}`;
  basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
    if (res.data && res.data.length > 0) {
      let surplusCount = res.data.reduce((count, item) => {
        return parseFloat(item.current_fytd_net_outly_amt) > 0 ? count + 1 : count;
      }, 0);
      //the + 4 is to account for surplus that are not in the data.
      setSurplus(surplusCount + 4);
    }
  });
}, []);
