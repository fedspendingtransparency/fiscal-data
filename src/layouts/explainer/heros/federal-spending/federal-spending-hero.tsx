import {
  footNotes,
  heroImageCallout,
  heroImageSubHeading,
  icon
} from "../../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import {
  getShortForm,
  getFootNotesDateRange,
  getPillData
} from "../hero-helper";


const FederalSpendingHero = (): JSX.Element => {
  const fields: string = 'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' +
    'record_calendar_month,record_calendar_year,record_fiscal_year';
  const filter: string = 'filter=line_code_nbr:eq:5691'
  const sort: string = 'sort=-record_date';
  const pagination: string = 'page[size]=1';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const spendingUrl: string = `${apiPrefix}${endpointUrl}`;

  const [totalSpending, setTotalSpending] = useState(null);
  const [priorYearSpending, setPriorYearSpending] = useState(0);
  const [priorFiscalYear, setPriorFiscalYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentFiscalYear, setCurrentFiscalYear] = useState(null);
  const [spendingChangeLabel, setSpendingChangeLabel] = useState(null);
  const [spendingChange, setSpendingChange] = useState( 0);
  const [spendingPercentChange, setSpendingPercentChange] = useState(0);

  const debt = <CustomLink url={'/national-debt/'}>Debt</CustomLink>;
  const deficit = <CustomLink url={'/national-deficit/'}>Deficit</CustomLink>;
  const mts =
    <CustomLink url={'/datasets/monthly-treasury-statement/outlays-of-the-u-s-government'}>
      Monthly Treasury Statement (MTS)
    </CustomLink>

  const getHeroData = (url) => {
    basicFetch(`${url}`)
      .then((res) => {
        if(res.data) {
          const data = res.data[0];
          const currentTotalSpending = data.current_fytd_net_outly_amt;
          const priorTotalSpending = data.prior_fytd_net_outly_amt;
          const difference = currentTotalSpending - priorTotalSpending;
          setTotalSpending(currentTotalSpending);
          setCurrentFiscalYear(data.record_fiscal_year);
          setPriorYearSpending(priorTotalSpending);
          setPriorFiscalYear(data.record_fiscal_year - 2);
          setCurrentMonth(data.record_calendar_month);
          setSpendingChange(difference);
          setSpendingPercentChange((difference / priorTotalSpending) * 100);

          if(currentTotalSpending > priorTotalSpending) {
            setSpendingChangeLabel("increased");
          } else if (currentTotalSpending < priorTotalSpending) {
            setSpendingChangeLabel("decreased");
          } else {
            setSpendingChangeLabel("not changed");
          }
        }
      });
  };

  useEffect(() => {
    getHeroData(spendingUrl);
  }, []);

  return (
    <>
      <p className={heroImageSubHeading}>
        The U.S. government has spent ${getShortForm(totalSpending, 2, false)} in
        fiscal year {currentFiscalYear} to ensure the well-being of the people of the United States.
      </p>
      <div>
        Flip card placeholder
      </div>
      <div className={footNotes}>
        <p>
          Fiscal Year-to-Date (since October {currentFiscalYear}) total updated monthly using
          the {mts} dataset.
        </p>
        <p>
          Compared to the federal spending of
          ${getShortForm(priorYearSpending.toString(), 1, false)} for the same period last
          year ({getFootNotesDateRange(priorFiscalYear, currentFiscalYear, currentMonth)}) our
          federal spending has {spendingChangeLabel} by
          ${getShortForm(spendingChange.toString(), 1, false)}.
        </p>
        {getPillData(spendingChange, spendingPercentChange, spendingChangeLabel, true, "#99C8C4")}
      </div>
      <div className={heroImageCallout} >
        <FontAwesomeIcon icon={faFlagUsa} className={icon} />
        <p>
          This topic is the third of four U.S. government financial concepts from Your Guide to
          America’s Finances with more being added in the coming months. We’ll help you learn
          more about money coming in (Revenue), money going out (Spending), and
          the {deficit} and {debt}.
        </p>
      </div>
    </>
  );
}

export default FederalSpendingHero;
