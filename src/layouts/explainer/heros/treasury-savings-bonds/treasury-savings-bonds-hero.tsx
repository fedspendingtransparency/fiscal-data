import React, { ReactElement, useState, useEffect } from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { footNotes, heroImageSubHeading, footNotesPillData, flapWrapper } from '../../hero-image/hero-image.module.scss';
import { getFootNotesDateRange, getPillData, getChangeLabel } from '../hero-helper';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';

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
        setPriorFiscalYear((parseInt(res.data[0].record_fiscal_year) - 1).toString());
        setPriorCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());
        setRecordCalendarMonth(res.data[0].record_calendar_month);
        const filterCurrentFY = `filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:${res.data[0].record_fiscal_year}`;
        const currentFYEndPoint = `v1/accounting/od/securities_sales?${filterCurrentFY}`;
        const currentFYReqUrl = `${apiPrefix}${currentFYEndPoint}`;
        basicFetch(`${currentFYReqUrl}`).then(res2 => {
          if (res2.data) {
            const currentTotalSavingsBonds = sumSavingsBondsAmount(res2.data);
            setTotalSavingsBondsInvested(currentTotalSavingsBonds);
            const filterPriorFY = `filter=security_type_desc:eq:Savings%20Bond,record_fiscal_year:eq:${(
              parseInt(res.data[0].record_fiscal_year) - 1
            ).toString()},record_calendar_month:eq:${res.data[0].record_calendar_month}`;
            const priorFYEndpoint = `v1/accounting/od/securities_sales?${filterPriorFY}`;
            const priorFYReqUrl = `${apiPrefix}${priorFYEndpoint}`;
            basicFetch(`${priorFYReqUrl}`).then(res3 => {
              if (res3.data) {
                const previousTotalSavingsBonds = sumSavingsBondsAmount(res3.data);
                setSavingsBondChangeLabel(getChangeLabel(currentTotalSavingsBonds, previousTotalSavingsBonds));
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
  };

  const electronicSecurities = (
    <CustomLink url="/datasets/electronic-securities-transactions/" id="Electronic Securities Transactions">
      Electronic Securities Transactions
    </CustomLink>
  );

  const rightTooltip = 'The percentage change in savings bonds investments compared to the same period last year.';
  const leftTooltip = `The total amount of investment in savings bonds has ${savingsBondChangeLabel} compared to the same period last year`;

  useEffect(() => {
    getHeroData();
  }, []);

  return (
    <>
      <p className={heroImageSubHeading}>
        The American public has invested ${getShortForm(totalSavingsBondsInvested, false)} in savings bonds this fiscal year to finance the federal
        government's operations.
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
            Compared to the same period last year ({getFootNotesDateRange(priorFiscalYear, priorCalendarYear, recordCalendarMonth)}), savings bonds
            investments have {savingsBondChangeLabel}.
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
