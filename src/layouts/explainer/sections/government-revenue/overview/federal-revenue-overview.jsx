import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {getShortForm} from "../../../heros/hero-helper";
import {get} from "react-scroll/modules/mixins/scroller";

const FederalRevenueOverview = () => {

  const [latestCompleteFiscalYear, setLatestCompleteFiscalYear] = useState(0);
  const [priorRevenue, setPriorRevenue] = useState('');
  const [priorSpend, setPriorSpend] = useState('');
  const [spendRevComp, setSpendRevComp] = useState('');
  const [deficitLabel, setDeficitLabel] = useState('');
  const [priorDeficit, setPriorDeficit] = useState('');

  useEffect(() => {
      const endpointURL = 'v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,'
        + 'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
      basicFetch(`${apiPrefix}${endpointURL}`)
        .then((res) => {
          if (res.data[0]) {
            setLatestCompleteFiscalYear(res.data[0].record_fiscal_year);
            setPriorRevenue(getShortForm(res.data[0].current_fytd_net_rcpt_amt, 2, false));
          }
        })
  }, []);

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691,'
      + 'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    basicFetch(`${apiPrefix}${endpointURL}`)
      .then((res) => {
        if (res.data[0]) {
          setPriorSpend(getShortForm(res.data[0].current_fytd_net_outly_amt, 2, false));
        }
      })
  }, []);

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694,'
      + 'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    basicFetch(`${apiPrefix}${endpointURL}`)
    .then((res) => {
      if (res.data[0]) {
        setPriorDeficit(getShortForm(res.data[0].current_fytd_net_outly_amt, 2, false))
        if (res.data[0].current_fytd_net_outly_amt < 0) {
          setSpendRevComp('more');
          setDeficitLabel('deficit');
        }
        else {
          setSpendRevComp('less');
          setDeficitLabel('surplus');
        }
      }
    })
  }, []);

  return(
    <div>
      <p>
        Where does federal revenue come from? If you lived or worked in the United States
        in {latestCompleteFiscalYear}, your tax contributions are likely part of
        the ${priorRevenue} collected in revenue. The federal government also collects
        revenue from services like admission to national parks and customs duties. This
        revenue is used to pay for goods and services provided to United States citizens
        and businesses.
      </p>
      <p>
        In FY {latestCompleteFiscalYear}, the federal government spent ${priorSpend}.
        Since the government spent {spendRevComp} than it collected,
        the {deficitLabel} for {latestCompleteFiscalYear} was ${priorDeficit}.
      </p>
    </div>
  );
}

export default FederalRevenueOverview;
