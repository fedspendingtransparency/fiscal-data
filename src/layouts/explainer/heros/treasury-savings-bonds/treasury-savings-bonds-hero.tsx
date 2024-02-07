import React, { ReactElement, useState } from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { footNotes, heroImageSubHeading, footNotesPillData, flapWrapper } from '../../hero-image/hero-image.module.scss';
import { getFootNotesDateRange, getPillData } from '../hero-helper';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';

const TreasurySavingsBondsHero = (): ReactElement => {
  // appending 40 to a 6 digit hex color is equivalent to specifying 25% opacity
  const pillColorWithTransparency = `#e2bee440`;

  const [totalSavingsBondsInvested, setTotalSavingsBondsInvested] = useState('323000000');
  const [priorFiscalYear, setPriorFiscalYear] = useState('2023');
  const [priorCalendarYear, setPriorCalendarYear] = useState('2022');
  const [recordCalendarMonth, setRecordCalendarMonth] = useState('12');
  const [savingsBondChangeLabel, setSavingsBondChangeLabel] = useState('increased');
  const [savingsBondChange, setSavingsBondChange] = useState(100000000);
  const [savingsBondPercentChange, setSavingsBondPercentChange] = useState(30);

  const numberFormat = new Intl.NumberFormat('en-US');

  const securitiesTreasuryDirect = (
    <CustomLink url="/datasets/securities-issued-in-treasurydirect" id="Securities Issued in Treasury Direct">
      Securities Issued In Treasury Direct
    </CustomLink>
  );

  const rightTooltip = 'The percentage change in savings bonds investments compared to the same period last year.';
  const leftTooltip = change => `The total amount of investment in savings bonds has ${savingsBondChangeLabel} compared to the same period last year`;

  return (
    <>
      <p className={heroImageSubHeading}>
        The American public has invested ${parseInt(totalSavingsBondsInvested) / 1000000} million in savings bonds this fiscal year to finance the
        federal government's operations.
      </p>
      <div className={flapWrapper}>
        <SplitFlapDisplay
          value={totalSavingsBondsInvested}
          mobilePrecision={parseInt(totalSavingsBondsInvested) > 999999999999 ? 2 : 0}
          minLength={numberFormat.format(parseInt(totalSavingsBondsInvested)).length}
          valueType="currency"
        />
      </div>
      <div className={footNotes}>
        <p>
          Fiscal year-to-date (Since October {priorFiscalYear}) total is updated monthly using the {securitiesTreasuryDirect} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the same period last year ({getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)}), savings bonds
            investments have {savingsBondChangeLabel}.
          </p>
          {getPillData(
            savingsBondChange,
            savingsBondPercentChange,
            savingsBondChangeLabel,
            true,
            pillColorWithTransparency,
            leftTooltip(savingsBondChangeLabel),
            rightTooltip
          )}
        </div>
      </div>
    </>
  );
};

export default TreasurySavingsBondsHero;
