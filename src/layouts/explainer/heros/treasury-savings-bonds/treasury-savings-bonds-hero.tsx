import React, { ReactElement, useState, useEffect } from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { footNotes, heroImageSubHeading, footNotesPillData, flapWrapper } from '../../hero-image/hero-image.module.scss';
import { getFootNotesDateRange, getPillData, getChangeLabel } from '../hero-helper';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';
import GlossaryPopoverDefinition from '../../../../components/glossary/glossary-term/glossary-popover-definition';
import { analyticsEventHandler } from '../../explainer-helpers/explainer-helpers';
import { glossaryGAEvent } from '../../sections/treasury-savings-bonds/treasury-savings-bonds';

const TreasurySavingsBondsHero = (): ReactElement => {
  // appending 40 to a 6 digit hex color is equivalent to specifying 25% opacity
  const pillColorWithTransparency = `#e2bee440`;

  const filter = 'filter=security_type_desc:eq:Savings%20Bond';
  const sort = 'sort=-record_date';
  const pagination = 'page[size]=1';
  const endpointUrl = `v1/accounting/od/securities_sales?${filter}&${sort}&${pagination}`;
  const securitiesSalesUrl = `${apiPrefix}${endpointUrl}`;

  const [totalSavingsBondsInvested, setTotalSavingsBondsInvested] = useState('');
  const [priorFiscalYear, setPriorFiscalYear] = useState('');
  const [priorCalendarYear, setPriorCalendarYear] = useState('');
  const [recordCalendarMonth, setRecordCalendarMonth] = useState('');
  const [savingsBondChangeLabel, setSavingsBondChangeLabel] = useState('');
  const [savingsBondChange, setSavingsBondChange] = useState(0);
  const [savingsBondPercentChange, setSavingsBondPercentChange] = useState(0);

  const numberFormat = new Intl.NumberFormat('en-US');

  const sumSavingsBondsAmount = data => {
    return data.reduce((n, { net_sales_amt }) => n + parseInt(net_sales_amt), 0);
  };

  const getHeroData = () => {
    basicFetch(`${securitiesSalesUrl}`).then(res => {
      if (res.data) {
        const priorFY = (parseInt(res.data[0].record_fiscal_year) - 1).toString();
        setPriorFiscalYear(priorFY);
        setPriorCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());
        setRecordCalendarMonth(res.data[0].record_calendar_month);
        const filterCurrentFY = `filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:${res.data[0].record_fiscal_year}`;
        const currentFYEndPoint = `v1/accounting/od/securities_sales?${filterCurrentFY}`;
        const currentFYReqUrl = `${apiPrefix}${currentFYEndPoint}`;
        basicFetch(`${currentFYReqUrl}`).then(res2 => {
          if (res2.data) {
            const currentTotalSavingsBonds = sumSavingsBondsAmount(res2.data);
            setTotalSavingsBondsInvested(currentTotalSavingsBonds);
            const priorYearFilter = `filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:${priorFY},record_calendar_month:eq:${res.data[0].record_calendar_month}&sort=-record_date&page[size]=1`;
            basicFetch(`${apiPrefix}v1/accounting/od/securities_sales?${priorYearFilter}`).then(priorYearRecordDate => {
              if (priorYearRecordDate.data) {
                const filterPriorFY = `filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:${(
                  parseInt(res.data[0].record_fiscal_year) - 1
                ).toString()},record_date:lte:${priorYearRecordDate.data[0].record_date}`;
                const priorFYEndpoint = `v1/accounting/od/securities_sales?${filterPriorFY}`;
                const priorFYReqUrl = `${apiPrefix}${priorFYEndpoint}`;
                basicFetch(`${priorFYReqUrl}`).then(res3 => {
                  if (res3.data) {
                    const previousTotalSavingsBonds = sumSavingsBondsAmount(res3.data);
                    setSavingsBondChangeLabel(getChangeLabel(currentTotalSavingsBonds, previousTotalSavingsBonds, false));
                    const changeDiff = currentTotalSavingsBonds - previousTotalSavingsBonds;
                    setSavingsBondChange(changeDiff);
                    const percentChange = (changeDiff / previousTotalSavingsBonds) * 100;
                    setSavingsBondPercentChange(percentChange);
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  const electronicSecurities = (
    <CustomLink
      url="/datasets/electronic-securities-transactions/"
      id="Electronic Securities Transactions"
      onClick={() => analyticsEventHandler('Electronic Securities Transactions', 'Savings Bonds Citation Click')}
    >
      Electronic Securities Transactions
    </CustomLink>
  );

  const savingsBonds = (
    <GlossaryPopoverDefinition term="Savings Bonds" page="Savings Bonds Explainer" handleClick={() => glossaryGAEvent('Savings Bonds')}>
      savings bonds
    </GlossaryPopoverDefinition>
  );

  const fiscalYear = (
    <GlossaryPopoverDefinition term="Fiscal Year" page="Savings Bonds Explainer" handleClick={() => glossaryGAEvent('Fiscal Year')}>
      fiscal year
    </GlossaryPopoverDefinition>
  );

  const rightTooltip = 'The percentage change in investments in savings bonds compared to the same period last year.';
  const leftTooltip = `The total amount of investment in savings bonds has ${savingsBondChangeLabel} compared to the same period last year`;

  useEffect(() => {
    getHeroData();
  }, []);

  return (
    <>
      <p className={heroImageSubHeading}>
        The American public invested ${getShortForm(totalSavingsBondsInvested, false)} in {savingsBonds} this {fiscalYear} to finance the federal
        government.
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
          Fiscal year-to-date (since October {priorFiscalYear}) total is updated monthly using the {electronicSecurities} dataset.
        </p>
        <div className={footNotesPillData}>
          <p>
            Compared to the same period last year ({getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)}), investments in
            savings bonds have {savingsBondChangeLabel} by ${getShortForm(savingsBondChange.toString(), false)}.
          </p>
          {getPillData(
            savingsBondChange,
            savingsBondPercentChange,
            savingsBondChangeLabel,
            true,
            pillColorWithTransparency,
            leftTooltip,
            rightTooltip
          )}
        </div>
      </div>
    </>
  );
};

export default TreasurySavingsBondsHero;
