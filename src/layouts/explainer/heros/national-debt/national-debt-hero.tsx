import { counterContainer, counterSourceInfo, debt } from '../../hero-image/hero-image.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import React, { useEffect, useState } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { debtToThePennyData, debtToThePennyLastCachedState } from '../../../../recoil/debtToThePennyDataState';
import useShouldRefreshCachedData from '../../../../recoil/hooks/useShouldRefreshCachedData';
import { explainerCitationsMap } from '../../explainer-helpers/explainer-helpers';

const NationalDebtHero = (): JSX.Element => {
  const [nationalDebtValue, setNationalDebtValue] = useState<string | null>(null);
  const data = useRecoilValueLoadable(debtToThePennyData);
  useShouldRefreshCachedData(Date.now(), debtToThePennyData, debtToThePennyLastCachedState);

  const numberFormat = new Intl.NumberFormat('en-US');

  const getCurrentNationalDebt = () => {
    if (data.state === 'hasValue') {
      const totalPublicDebtOutstanding: string = Math.trunc(data.contents.payload[0]['tot_pub_debt_out_amt']).toString();
      setNationalDebtValue(totalPublicDebtOutstanding);
    }
  };

  useEffect(() => {
    getCurrentNationalDebt();
  }, [data.state]);

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
