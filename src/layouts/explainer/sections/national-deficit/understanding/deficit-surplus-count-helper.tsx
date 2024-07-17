import { useState, useEffect } from 'react';
import { apiPrefix, basicFetch } from '../../../../../utils/api-utils';

interface FiscalData {
  current_fytd_net_outly_amt: number;
}

const useFetchSurplusCount = (startYear: number): number => {
  const [surplus, setSurplus] = useState<number>(4); // Start with an initial surplus of 4 not included in data

  useEffect(() => {
    const fields = 'fields=current_fytd_net_outly_amt,record_date,record_calendar_month,record_fiscal_year';
    const sort = 'sort=record_date';
    const endpointUrl = `v1/accounting/mts/mts_table_5?${fields}&filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&${sort}`;
    basicFetch(`${apiPrefix}${endpointUrl}`).then(res => {
      if (res.data) {
        const surplusCount = res.data.reduce((count, item: FiscalData) => {
          return item.current_fytd_net_outly_amt > 0 ? count + 1 : count;
        }, 0);

        setSurplus(prev => prev + surplusCount);
      }
    });
  }, [startYear]);

  return surplus;
};

export default useFetchSurplusCount;
