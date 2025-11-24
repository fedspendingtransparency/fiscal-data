import { flapWrapper, footNotes, footNotesPillData, heroImageSubHeading } from '../../hero-image/hero-image.module.scss';
import React, { ReactElement, useEffect, useState } from 'react';
import { getChangeLabel, getFootNotesDateRange, getPillData, spendingUrl } from '../hero-helper';
import { spendingExplainerPrimary } from '../../sections/federal-spending/federal-spending.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import { getShortForm } from '../../../../utils/rounding-utils';
import { getDataFromCacheOrFetch } from '../../../../../react-query-client';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

const FederalSpendingHero = (): ReactElement => {
  const [totalSpending, setTotalSpending] = useState(null);
  const [priorYearSpending, setPriorYearSpending] = useState(0);
  const [priorFiscalYear, setPriorFiscalYear] = useState(null);
  const [priorCalendarYear, setPriorCalendarYear] = useState(null);
  const [recordFiscalYear, setRecordFiscalYear] = useState(null);
  const [recordCalendarMonth, setRecordCalendarMonth] = useState(null);
  const [spendingChangeLabel, setSpendingChangeLabel] = useState(null);
  const [spendingChange, setSpendingChange] = useState(0);
  const [spendingPercentChange, setSpendingPercentChange] = useState(0);

  const numberFormat = new Intl.NumberFormat('en-US');

  const { mtsOutlays } = explainerCitationsMap['federal-spending'];

  useEffect(() => {
    getDataFromCacheOrFetch('heros', spendingUrl, processSpendingHeroData);
  }, []);

  const processSpendingHeroData = res => {
    if (res.data) {
      const data = res.data[0];
      const currentTotalSpending = parseFloat(data.current_fytd_net_outly_amt);
      const priorTotalSpending = parseFloat(data.prior_fytd_net_outly_amt);
      const difference = currentTotalSpending - priorTotalSpending;
      setTotalSpending(currentTotalSpending);
      setRecordFiscalYear(data.record_fiscal_year);
      setPriorYearSpending(priorTotalSpending);
      setPriorFiscalYear(data.record_fiscal_year - 1);
      setPriorCalendarYear(data.record_calendar_year - 1);
      setRecordCalendarMonth(data.record_calendar_month);
      setSpendingChange(difference);
      setSpendingPercentChange((difference / priorTotalSpending) * 100);
      setSpendingChangeLabel(getChangeLabel(currentTotalSpending, priorTotalSpending, false));
    }
  };

  const rightTooltipText = 'The percentage change in spending compared to the same period last year.';

  return (
    <>
      <p className={heroImageSubHeading}>
        The U.S. government has spent ${getShortForm(totalSpending, false)} in fiscal year {recordFiscalYear} to ensure the well-being of the people
        of the United States.
      </p>
      <div className={flapWrapper}>
        <SplitFlapDisplay
          value={totalSpending}
          minLength={numberFormat.format(parseInt(totalSpending)).length} // number of characters to initially display
          mobilePrecision={parseInt(totalSpending) > 999999999999 ? 2 : 0}
          valueType="currency"
        />
      </div>
      <div className={footNotes}>
        <p>
          Fiscal year-to-date (since October {priorFiscalYear}) total updated monthly using the {mtsOutlays} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the federal spending of ${getShortForm(priorYearSpending.toString(), false)} for the same period last year (
            {getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)}) our federal spending has {spendingChangeLabel} by $
            {getShortForm(spendingChange.toString(), false)}.
          </p>
          {getPillData(
            spendingChange,
            spendingPercentChange,
            spendingChangeLabel,
            true,
            spendingExplainerPrimary + '25',
            `The total amount spending has ${spendingChangeLabel} compared to the same period last year.`,
            rightTooltipText
          )}
        </div>
      </div>
    </>
  );
};

export default FederalSpendingHero;
