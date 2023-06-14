import React, {useEffect, useState} from "react";
import CustomLink from "../../../../../components/links/custom-link/custom-link";
import {apiPrefix, basicFetch} from "../../../../../utils/api-utils";
import {getShortForm} from "../../../../../utils/rounding-utils";

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
            setPriorRevenue(getShortForm(res.data[0].current_fytd_net_rcpt_amt, false));
          }
        })
  }, []);

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691,'
      + 'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    basicFetch(`${apiPrefix}${endpointURL}`)
      .then((res) => {
        if (res.data[0]) {
          setPriorSpend(getShortForm(res.data[0].current_fytd_net_outly_amt, false));
        }
      })
  }, []);

  useEffect(() => {
    const endpointURL = 'v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694,'
      + 'record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1';
    basicFetch(`${apiPrefix}${endpointURL}`)
    .then((res) => {
      if (res.data[0]) {
        setPriorDeficit(getShortForm(res.data[0].current_fytd_net_outly_amt, false))
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

  const spending = (
    <CustomLink
      url="/americas-finance-guide/federal-spending/"
      eventNumber="33"
      id="Federal Spending"
    >
      Spending
    </CustomLink>
  );

  const deficit = (
    <CustomLink
      url="/americas-finance-guide/national-deficit/"
      eventNumber="32"
      id="National Deficit"
    >
      Deficit
    </CustomLink>
  );

  return (
    <div>
      <p>
        Where does federal revenue come from? If you lived or worked in the
        United States in {latestCompleteFiscalYear}, your tax contributions are
        likely part of the ${priorRevenue} collected in revenue. The federal
        government also collects revenue from services like admission to
        national parks and customs duties on foreign imports and exports. The
        majority of this revenue is used to pay for government activities
        (employee salaries, infrastructure maintenance), as well as to pay for
        goods and services provided to United States citizens and businesses.
      </p>
      <p>
        In FY {latestCompleteFiscalYear}, the federal government spent $
        {priorSpend}. Since the government spent {spendRevComp} than it
        collected, the {deficitLabel} for {latestCompleteFiscalYear} was $
        {priorDeficit}.  Visit our {spending} and {deficit} pages for more information on these activities.
      </p>
    </div>
  );
}

export default FederalRevenueOverview;
