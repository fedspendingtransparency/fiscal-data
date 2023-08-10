import {
  counterContainer,
  counterSourceInfo, debt,
} from "../../hero-image/hero-image.module.scss";
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import Analytics from "../../../../utils/analytics/analytics";

const NationalDebtHero = (): JSX.Element => {
  const fields: string = 'fields=tot_pub_debt_out_amt,record_date';
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1&page[number]=1';
  const endpointUrl: string
    = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl: string = `${apiPrefix}${endpointUrl}`;

  const [nationalDebtValue, setNationalDebtValue] = useState<string | null>(null);

  const numberFormat = new Intl.NumberFormat('en-US');

  const getCurrentNationalDebt = (url) => {
    basicFetch(`${url}`)
      .then((res) => {
        if (res.data) {
          const totalPublicDebtOutstanding: string =
            Math.trunc(res.data[0]['tot_pub_debt_out_amt']).toString();
            setNationalDebtValue(totalPublicDebtOutstanding);
        }
    });
  };

  useEffect(() => {
    getCurrentNationalDebt(debtUrl);
  }, []);

  const clickHandler = () => {
    Analytics.event({
      category: 'Explainers',
      action: `Citation Click`,
      label: `Debt - What is the national debt?`
    });
  }

  return (
    <>
          <div className={counterContainer}>
            <SplitFlapDisplay value={nationalDebtValue}
                              minLength={numberFormat.format(parseInt(nationalDebtValue)).length} // number of characters to initially display
                              mobilePrecision={parseInt(nationalDebtValue) > 999999999999 ? 2 : 0}
                              valueType="currency"
            />
          </div>
          <div className={`${counterSourceInfo} ${debt}`}>
            Updated daily from the {' '}
            <CustomLink
              url={'/datasets/debt-to-the-penny'}
              onClick={() => clickHandler()}
              id="Debt to the Penny"
            >
              Debt to the Penny
            </CustomLink> dataset.
          </div>
    </>
  );
}
export default NationalDebtHero;
