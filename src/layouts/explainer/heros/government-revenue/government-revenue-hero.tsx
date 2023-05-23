import React, {useEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {
  footNotes,
  heroImageSubHeading,
  footNotesPillData,
  flapWrapper
} from "../../hero-image/hero-image.module.scss"
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import { getFootNotesDateRange, getPillData } from "../hero-helper"
import {
  revenueExplainerLightSecondary } from "../../sections/government-revenue/revenue.module.scss"
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display";
import GlossaryPopoverDefinition from "../../../../components/glossary/glossary-term/glossary-popover-definition";
import {getShortForm} from "../../../../utils/rounding-utils";

const GovernmentRevenueHero = ({glossary, glossaryClickHandler}): JSX.Element => {

  const fields: string = 'fields=current_fytd_net_rcpt_amt,prior_fytd_net_rcpt_amt,' +
    'record_calendar_month,record_calendar_year,record_fiscal_year,record_date';
  const filter: string = 'filter=line_code_nbr:eq:830'
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_4?${fields}&${filter}&${sort}&${pagination}`;
  const revenueUrl: string = `${apiPrefix}${endpointUrl}`;

  // appending 40 to a 6 digit hex color is equivalent to specifiying 25% opacity
  const pillColorWithTransparency = `${revenueExplainerLightSecondary}40`;

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
    <CustomLink
      url={'/datasets/monthly-treasury-statement/receipts-of-the-u-s-government'}
      eventNumber={'4'}
    >
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

  const expenditures = (
    <GlossaryPopoverDefinition
      term={"Expenditures"}
      page={"Revenue Explainer"}
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      expenditures
    </GlossaryPopoverDefinition>
  );

  const rightTooltip =
    'The percentage change in revenue compared to the same period last year.';
  const leftTooltip = (change) =>
    `The total amount revenue has ${change} compared to the same period last year.`;

  return (
    <>
      <p className={heroImageSubHeading}>
        Government revenue is income received from taxes and other sources to
        pay for government {expenditures}. The U.S. government has collected $
        {getShortForm(currentRevenue, false)} in fiscal year{" "}
        {recordFiscalYear}.
      </p>
      <div className={flapWrapper}>
        <SplitFlapDisplay
          value={currentRevenue}
          mobilePrecision={parseInt(currentRevenue) > 999999999999 ? 2 : 0}
          minLength={currentRevenue?.toString().length}
          valueType="currency"
        />
      </div>
      <div className={footNotes}>
        <p>
          Fiscal year-to-date (since October {priorFiscalYear}) total updated
          monthly using the {mts} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the federal revenue of $
            {getShortForm(priorYearRevenue.toString(), false)} for the same
            period last year (
            {getFootNotesDateRange(
              priorFiscalYear,
              priorCalendarYear,
              recordCalendarMonth
            )}
            ) federal revenue has {revenueChangeLabel} by $
            {getShortForm(revenueChange.toString(), false)}.
          </p>
          {getPillData(
            revenueChange,
            revenuePercentChange,
            revenueChangeLabel,
            true,
            pillColorWithTransparency,
            leftTooltip(revenueChangeLabel),
            rightTooltip
          )}
        </div>
      </div>
    </>
  )
}

export default GovernmentRevenueHero;
