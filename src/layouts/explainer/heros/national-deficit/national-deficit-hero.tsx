import React, { ReactElement, useEffect, useState } from 'react';
import {
  counterSourceInfo,
  footNotes,
  deficitBoxContainer,
  heroImageSubHeading,
  deficit,
  flapWrapper,
} from '../../hero-image/hero-image.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import GlossaryPopoverDefinition from '../../../../components/glossary/glossary-term/glossary-popover-definition';
import { getChangeLabel, getFootNotesDateRange, getPillData, deficitUrl } from '../hero-helper';
import { getShortForm } from '../../../../utils/rounding-utils';
import { getDataFromCacheOrFetch } from '../../../../../react-query-client';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

const NationalDeficitHero = (): ReactElement => {
  const deficitPillColor = '#b3532d1a';

  const rightPillTooltipHoverText = 'The percentage change in the deficit compared to the same period last year.';

  const [textCurrentDeficit, setTextCurrentDeficit] = useState<string | null>(null);
  const [desktopDeficit, setDesktopDeficit] = useState<string | null>(null);
  const [desktopPriorDeficit, setDesktopPriorDeficit] = useState<string | null>(null);
  const [currentRecordMonth, setCurrentRecordMonth] = useState<string>('');
  const [previousCalendarYear, setPreviousCalendarYear] = useState<string>('');
  const [previousFiscalYear, setPreviousFiscalYear] = useState<string>('');
  const [currentFiscalYear, setCurrentFiscalYear] = useState<string>('');
  const [deficitStatus, setDeficitStatus] = useState<string>('');
  const [deficitDif, setDeficitDif] = useState<string>('');
  const [deficitDifPill, setDeficitDifPill] = useState<number>(0);
  const [deficitDifPercent, setDeficitDifPercent] = useState<number>(0);

  const numberFormat = new Intl.NumberFormat('en-US');

  useEffect(() => {
    getDataFromCacheOrFetch('heros', deficitUrl, processDeficitHeroData);
  }, []);

  const processDeficitHeroData = res => {
    if (res.data) {
      // create local variable to immediately find last complete year record
      const lastFiscalYear = (Number(res.data[0].record_fiscal_year) - 1).toString();
      setCurrentFiscalYear(res.data[0].record_fiscal_year);

      setPreviousFiscalYear(lastFiscalYear);

      setTextCurrentDeficit(getShortForm(res.data[0].current_fytd_net_outly_amt, false));

      setPreviousCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());

      setDesktopDeficit(Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt)).toFixed());
      setDesktopPriorDeficit(getShortForm(Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)).toFixed(), false));
      const date = new Date();
      date.setDate(15);
      date.setMonth(parseInt(res.data[0].record_calendar_month) - 1);
      setCurrentRecordMonth(res.data[0].record_calendar_month);
      const currentDeficit = Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt));
      const priorYearDeficit = Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt));
      setDeficitDif(getShortForm(Math.abs(priorYearDeficit - currentDeficit).toString(), false));
      setDeficitDifPill(Math.abs(priorYearDeficit - currentDeficit));
      setDeficitDifPercent(parseFloat((((currentDeficit - priorYearDeficit) / priorYearDeficit) * 100).toFixed()));
      setDeficitStatus(getChangeLabel(currentDeficit, priorYearDeficit, false));
    }
  };

  const { mtsSummary } = explainerCitationsMap['national-deficit'];

  const fiscalYear = (
    <GlossaryPopoverDefinition term="fiscal year" page="Deficit Explainer">
      fiscal year (FY)
    </GlossaryPopoverDefinition>
  );

  const changeNationalDeficitFooter = (
    <>
      {deficitStatus !== 'not changed' ? (
        <p>
          Compared to the national deficit of ${desktopPriorDeficit} for the same period last year (
          {getFootNotesDateRange(previousFiscalYear, previousCalendarYear, currentRecordMonth)}), our national deficit has {deficitStatus} by $
          {deficitDif}.
        </p>
      ) : (
        <p>
          Compared to the national deficit of ${desktopPriorDeficit} for the same period last year{' '}
          {getFootNotesDateRange(previousFiscalYear, previousCalendarYear, currentRecordMonth)}, our national deficit has {deficitStatus}.
        </p>
      )}
    </>
  );

  return (
    <>
      <p className={`${heroImageSubHeading} ${deficit}`}>
        A deficit occurs when the federal government’s spending exceeds its revenues. The federal government has spent ${textCurrentDeficit} more than
        it has collected in {fiscalYear} {currentFiscalYear}, resulting in a national deficit.
      </p>
      <div className={flapWrapper}>
        <SplitFlapDisplay
          value={desktopDeficit}
          mobilePrecision={parseInt(desktopDeficit) > 999999999999 ? 2 : 0}
          minLength={numberFormat.format(parseInt(desktopDeficit)).length} // number of characters to initially display
          valueType="currency"
        />
      </div>
      <div className={`${counterSourceInfo} ${deficit}`}>
        <p>
          Fiscal year-to-date (since October {previousFiscalYear}) total updated monthly using the {mtsSummary} dataset.
        </p>
      </div>
      <div className={footNotes}>{changeNationalDeficitFooter}</div>
      <div className={deficitBoxContainer}>
        {getPillData(
          deficitDifPill,
          deficitDifPercent,
          deficitStatus,
          true,
          deficitPillColor,
          `The total amount the deficit has ${deficitStatus} compared to the same period last year.`,
          rightPillTooltipHoverText
        )}
      </div>
    </>
  );
};
export default NationalDeficitHero;
