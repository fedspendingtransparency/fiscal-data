import { counterContainer, counterSourceInfo, debt } from '../../hero-image/hero-image.module.scss';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import React, { useEffect, useState } from 'react';
import { apiPrefix } from '../../../../utils/api-utils';
import Analytics from '../../../../utils/analytics/analytics';
import { useRecoilValueLoadable } from 'recoil';
import { useSetRecoilState } from 'recoil';
import { debtToThePennyDataState, debtToThePennyURLState } from '../../../../recoil/debtToThePennyDataState';

const NationalDebtHero = (): JSX.Element => {
  const fields: string = 'fields=tot_pub_debt_out_amt,record_date';
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1&page[number]=1';
  const endpointUrl: string = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl: string = `${apiPrefix}${endpointUrl}`;

  const [nationalDebtValue, setNationalDebtValue] = useState<string | null>(null);
  const setURL = useSetRecoilState(debtToThePennyURLState);
  const data = useRecoilValueLoadable(debtToThePennyDataState);

  const numberFormat = new Intl.NumberFormat('en-US');

  useEffect(() => {
    setURL(debtUrl);
  }, []);

  const getCurrentNationalDebt = () => {
    if (data.state === 'hasValue') {
      const totalPublicDebtOutstanding: string = Math.trunc(data.contents.data[0]['tot_pub_debt_out_amt']).toString();
      setNationalDebtValue(totalPublicDebtOutstanding);
    }
  };

  useEffect(() => {
    getCurrentNationalDebt();
  }, [data.state]);

  const clickHandler = () => {
    Analytics.event({
      category: 'Explainers',
      action: `Citation Click`,
      label: `Debt - What is the national debt?`,
    });
  };

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
      <div className={`${counterSourceInfo} ${debt}`}>
        Updated daily from the{' '}
        <CustomLink url={'/datasets/debt-to-the-penny'} onClick={() => clickHandler()} id="Debt to the Penny">
          Debt to the Penny
        </CustomLink>{' '}
        dataset.
      </div>
    </>
  );
};
export default NationalDebtHero;
