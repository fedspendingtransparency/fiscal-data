import {counterContainer, counterSourceInfo} from "../../hero-image/hero-image.module.scss";
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";

const NationalDebtHero = (): JSX.Element => {
  const fields: string = 'fields=tot_pub_debt_out_amt,record_date';
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1&page[number]=1';
  const endpointUrl: string
    = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl: string = `${apiPrefix}${endpointUrl}`;

  const [nationalDebtValue, setNationalDebtValue]
    = useState<string | null>("99999999999999.99");

  const getCurrentNationalDebt = (url) => {
    basicFetch(`${url}`)
      .then((res) => {
        if (res.data) {
          const totalPublicDebtOutstanding: string = res.data[0]['tot_pub_debt_out_amt'];
          setNationalDebtValue(totalPublicDebtOutstanding);
        }
    });
  };

  useEffect(() => {
    getCurrentNationalDebt(debtUrl);
  }, []);

  return (
    <>
      {nationalDebtValue !== null &&
      (
        <div className={counterContainer}>
          <SplitFlapDisplay value={nationalDebtValue}
                            minLength={21} // number of characters to initially display
                            valueType="currency"
          />
          <div className={counterSourceInfo}>
            This number is updated daily from the{' '}
            <CustomLink url={'/datasets/debt-to-the-penny'}>Debt to the Penny</CustomLink> dataset.
          </div>
        </div>
      )
      }
    </>
  );
}
export default NationalDebtHero;
