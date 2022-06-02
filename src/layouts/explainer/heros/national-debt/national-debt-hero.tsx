import {counterContainer, counterSourceInfo, heroImageCallout,calloutContainer, icon} from "../../hero-image/hero-image.module.scss";
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React, {useEffect, useState} from "react";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa} from "@fortawesome/free-solid-svg-icons";

const NationalDebtHero = (): JSX.Element => {
  const fields: string = 'fields=tot_pub_debt_out_amt,record_date';
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1&page[number]=1';
  const endpointUrl: string
    = `v2/accounting/od/debt_to_penny?${fields}&${sort}&${pagination}`;
  const debtUrl: string = `${apiPrefix}${endpointUrl}`;

  const [nationalDebtValue, setNationalDebtValue]
    = useState<string | null>("99999999999999");

  const getCurrentNationalDebt = (url) => {
    basicFetch(`${url}`)
      .then((res) => {
        if (res.data) {
          const totalPublicDebtOutstanding: string = Math.trunc(res.data[0]['tot_pub_debt_out_amt']).toString();
          setNationalDebtValue(totalPublicDebtOutstanding);
          console.log(nationalDebtValue);
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
                            minLength={18} // number of characters to initially display
                            valueType="currency"
          />
          <div className={counterSourceInfo}>
            Updated daily from the {' '}
            <CustomLink url={'/datasets/debt-to-the-penny'}>Debt to the Penny</CustomLink> dataset.
          </div>
        </div>
      )
      }
      <div className={calloutContainer}>
        <div className={heroImageCallout} data-testid={"nationalDebtCallout"}>
          <FontAwesomeIcon icon={faFlagUsa} className={icon}/>
          <p>
            This topic is the first of four U.S. government financial concepts from Your Guide to
            America’s Finances with more being added in the coming months.
            We’ll help you learn more about money coming in (Revenue), money going out (Spending), the Deficit, and Debt.
          </p>
        </div>
      </div>
    </>
  );
}
export default NationalDebtHero;
