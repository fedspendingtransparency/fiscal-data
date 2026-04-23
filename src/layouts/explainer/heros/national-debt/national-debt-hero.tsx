import { counterContainer, counterSourceInfo, debt } from '../../hero-image/hero-image.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import React, { useEffect, useState } from 'react';
import { debtToThePennyData } from '../../../../recoil/debtToThePennyDataState';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

const NationalDebtHero = (): JSX.Element => {
  const [nationalDebtValue, setNationalDebtValue] = useState<string | null>(null);
  const payload = debtToThePennyData(state => state.payload);
  const status = debtToThePennyData(state => state.status);
  const refreshIfStale = debtToThePennyData(state => state.refreshIfStale);
  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const numberFormat = new Intl.NumberFormat('en-US');

  useEffect(() => {
    if (status === 'hasValue' && payload) {
      const totalPublicDebtOutstanding: string = Math.trunc(payload[0]['tot_pub_debt_out_amt']).toString();
      setNationalDebtValue(totalPublicDebtOutstanding);
    }
  }, [status, payload]);

  const { debtToThePenny } = explainerCitationsMap['national-debt'];

  return (
    <>
      <div className={counterContainer}>
        <SplitFlapDisplay
          value={nationalDebtValue}
          minLength={numberFormat.format(parseInt(nationalDebtValue)).length} // number of characters to initially display
          mobilePrecision={parseInt(nationalDebtValue) > 999999999999 ? 2 : 0}
          valueType="currency"
        />
      </div>
      <div className={`${counterSourceInfo} ${debt}`}>Updated daily from the {debtToThePenny} dataset.</div>
    </>
  );
};
export default NationalDebtHero;
