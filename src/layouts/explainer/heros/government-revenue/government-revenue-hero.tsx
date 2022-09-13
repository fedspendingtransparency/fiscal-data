import React, {useEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {
  footNotes,
  heroImageSubHeading,
  footNotesPillData,
} from "../../hero-image/hero-image.module.scss"
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import { getFootNotesDateRange, getPillData, getShortForm } from "../hero-helper"
import {
  revenueExplainerLightSecondary } from "../../sections/government-revenue/revenue.module.scss"
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display";

const GovernmentRevenueHero = (): JSX.Element => {

  const fields: string = 'fields=current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,' +
    'record_calendar_month,record_calendar_year,record_fiscal_year,record_date';
  const filter: string = 'filter=line_code_nbr:eq:830'
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_4?${fields}&${filter}&${sort}&${pagination}`;
  const revenueUrl: string = `${apiPrefix}${endpointUrl}`;

  const [currentRevenue, setCurrentRevenue] = useState(null);
  const [priorYearRevenue, setPriorYearRevenue] = useState(0);
  const [priorFiscalYear, setPriorFiscalYear] = useState(null);
  const [priorCalendarYear, setPriorCalendarYear] = useState(null);
  const [recordFiscalYear, setRecordFiscalYear] = useState(null);
  const [recordCalendarMonth, setRecordCalendarMonth] = useState(null);
  const [revenueChangeLabel, setRevenueChangeLabel] = useState(null);
  const [revenueChange, setRevenueChange] = useState( 0);
  const [revenuePercentChange, setRevenuePercentChange] = useState(0);

  const mts =
    <CustomLink url={'/datasets/monthly-treasury-statement/receipts-of-the-u-s-government'}>
      Monthly Treasury Statement (MTS)
    </CustomLink>

  const getHeroData = (url) => {
    basicFetch(`${url}`)
      .then((res) => {
        if(res.data) {
          const data = res.data[0];
          const currentTotalRevenue = data.current_fytd_net_rcpt_amt || 0;
          const priorTotalRevenue = data.prior_fytd_net_rcpt_amt || 0;
          const difference = currentTotalRevenue - priorTotalRevenue;
          setCurrentRevenue(currentTotalRevenue);
          setRecordFiscalYear(data.record_fiscal_year);
          setPriorYearRevenue(priorTotalRevenue);
          setPriorFiscalYear(data.record_fiscal_year - 1);
          setPriorCalendarYear(data.record_calendar_year - 1);
          setRecordCalendarMonth(data.record_calendar_month);
          setRevenueChange(difference);
          setRevenuePercentChange((difference / priorTotalRevenue) * 100);

          if(currentTotalRevenue > priorTotalRevenue) {
            setRevenueChangeLabel("increased");
          } else if (currentTotalRevenue < priorTotalRevenue) {
            setRevenueChangeLabel("decreased");
          } else {
            setRevenueChangeLabel("not changed");
          }
        }
      });
  };

  useEffect(() => {
    getHeroData(revenueUrl);
  }, []);

  return (
    <>
      <p className={heroImageSubHeading}>
        Government revenue is income received from taxes and other sources to pay for
        government expenditures. The U.S. government has collected {' '}
        ${getShortForm(currentRevenue, 2, false)} {' '}
        in fiscal year {recordFiscalYear}.
      </p>
      <div>
        <SplitFlapDisplay value={currentRevenue}
                          minLength={17} // number of characters to initially display
                          valueType="currency"
        />
      </div>
      <div className={footNotes}>
        <p>
          Fiscal Year-to-Date (since October {priorFiscalYear}) total updated monthly using
          the {mts} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the national revenue of
            ${getShortForm(priorYearRevenue.toString(), 1, false)} for the same period
            last year
            ({getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)})
            national revenue has {revenueChangeLabel} by
            ${getShortForm(revenueChange.toString(), 1, false)}.
          </p>
          {getPillData(revenueChange, revenuePercentChange, revenueChangeLabel,
            true, revenueExplainerLightSecondary)}
        </div>
      </div>
    </>
  );
}

export default GovernmentRevenueHero;
