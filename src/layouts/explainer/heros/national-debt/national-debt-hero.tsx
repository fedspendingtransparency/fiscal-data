import {counterContainer, counterSourceInfo} from "../../hero-image/hero-image.module.scss";
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

  const [nationalDebtValue, setNationalDebtValue]
    = useState<string | null>(null);

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
      {nationalDebtValue !== null &&
      (
        <div className={counterContainer}>
          <SplitFlapDisplay value={nationalDebtValue}
                            minLength={18} // number of characters to initially display
                            valueType="currency"
          />
          <div className={counterSourceInfo}>
            Updated daily from the {' '}
            <CustomLink url={'/datasets/debt-to-the-penny'} onClick={() => clickHandler()}>
              Debt to the Penny
            </CustomLink> dataset.
          </div>
        </div>
      )
      }
    </>
  );
}
export default NationalDebtHero;
