import React, { ReactElement, useEffect, useState } from 'react';
import { footNotes, heroImageSubHeading, footNotesPillData, flapWrapper } from '../../hero-image/hero-image.module.scss';
import { getFootNotesDateRange, getPillData, revenueHeroUrl } from '../hero-helper';
import { revenueExplainerLightSecondary } from '../../../../variables.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import GlossaryPopoverDefinition from '../../../../components/glossary/glossary-term/glossary-popover-definition';
import { getShortForm } from '../../../../utils/rounding-utils';
import { getDataFromCacheOrFetch } from '../../../../../react-query-client';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

const GovernmentRevenueHero = (): ReactElement => {
  useEffect(() => {
    getDataFromCacheOrFetch('heros', revenueHeroUrl, processRevenueHeroData);
  }, []);

  const processRevenueHeroData = res => {
    if (res.data) {
      const data = res.data[0];
      const currentTotalRevenue = parseFloat(data.current_fytd_net_rcpt_amt) || 0;
      const priorTotalRevenue = parseFloat(data.prior_fytd_net_rcpt_amt) || 0;
      const difference = currentTotalRevenue - priorTotalRevenue;
      setCurrentRevenue(currentTotalRevenue);
      setRecordFiscalYear(data.record_fiscal_year);
      setPriorYearRevenue(priorTotalRevenue);
      setPriorFiscalYear(data.record_fiscal_year - 1);
      setPriorCalendarYear(data.record_calendar_year - 1);
      setRecordCalendarMonth(data.record_calendar_month);
      setRevenueChange(difference);
      setRevenuePercentChange((difference / priorTotalRevenue) * 100);

      if (currentTotalRevenue > priorTotalRevenue) {
        setRevenueChangeLabel('increased');
      } else if (currentTotalRevenue < priorTotalRevenue) {
        setRevenueChangeLabel('decreased');
      } else {
        setRevenueChangeLabel('not changed');
      }
    }
  };

  // appending 40 to a 6 digit hex color is equivalent to specifying 25% opacity
  const pillColorWithTransparency = `${revenueExplainerLightSecondary}40`;

  const [currentRevenue, setCurrentRevenue] = useState(null);
  const [priorYearRevenue, setPriorYearRevenue] = useState(0);
  const [priorFiscalYear, setPriorFiscalYear] = useState(null);
  const [priorCalendarYear, setPriorCalendarYear] = useState(null);
  const [recordFiscalYear, setRecordFiscalYear] = useState(null);
  const [recordCalendarMonth, setRecordCalendarMonth] = useState(null);
  const [revenueChangeLabel, setRevenueChangeLabel] = useState(null);
  const [revenueChange, setRevenueChange] = useState(0);
  const [revenuePercentChange, setRevenuePercentChange] = useState(0);

  const numberFormat = new Intl.NumberFormat('en-US');
  const { mtsReceipts } = explainerCitationsMap['government-revenue'];

  const expenditures = (
    <GlossaryPopoverDefinition term="Expenditures" page="Revenue Explainer">
      expenditures
    </GlossaryPopoverDefinition>
  );

  const rightTooltip = 'The percentage change in revenue compared to the same period last year.';
  const leftTooltip = change => `The total amount revenue has ${change} compared to the same period last year.`;

  return (
    <>
      <p className={heroImageSubHeading}>
        Government revenue is income received from taxes and other sources to pay for government {expenditures}. The U.S. government has collected $
        {getShortForm(currentRevenue, false)} in fiscal year {recordFiscalYear}.
      </p>
      <div className={flapWrapper}>
        <SplitFlapDisplay
          value={currentRevenue}
          mobilePrecision={parseInt(currentRevenue) > 999999999999 ? 2 : 0}
          minLength={numberFormat.format(parseInt(currentRevenue)).length}
          valueType="currency"
        />
      </div>
      <div className={footNotes}>
        <p>
          Fiscal year-to-date (since October {priorFiscalYear}) total updated monthly using the {mtsReceipts} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the federal revenue of ${getShortForm(priorYearRevenue.toString(), false)} for the same period last year (
            {getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)}) federal revenue has {revenueChangeLabel} by $
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
  );
};

export default GovernmentRevenueHero;
