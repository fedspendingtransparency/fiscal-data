import React, {useEffect, useLayoutEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {
  calloutContainer,
  counterSourceInfo,
  heroImageCallout,
  icon,
  footNotes,
  deficitBox,
  deficitBoxPercent,
  deficitBoxContainer,
  deficitArrow,
  heroImageSubHeading,
} from "../../hero-image/hero-image.module.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa, faDownLong, faUpLong} from "@fortawesome/free-solid-svg-icons";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import {numberWithCommas} from "../../../../helpers/simplify-number/simplifyNumber";
import {pxToNumber} from "../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../variables.module.scss";
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display"

const NationalDeficitHero = (): JSX.Element => {
  const fields: string = 'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year';
  const sort: string = 'sort=-record_date';
  const filter: string = 'filter=line_code_nbr:eq:5694'
  const pagination: string = 'page[size]=13';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const deficitUrl: string = `${apiPrefix}${endpointUrl}`;

  const [displayedPriorDeficitValue, setDisplayedPriorDeficitValue] =
    useState<string | null>(null);

  const [textPreviousDeficit, setTextPreviousDeficit] = useState<string | null>(null);
  const [desktopDeficit, setDesktopDeficit] = useState<string | null>(null);
  const [desktopPriorDeficit, setDesktopPriorDeficit] = useState<string | null>(null);
  const [mobilePriorDeficit, setMobilePriorDeficit] = useState<string | null>(null);
  const [currentRecordMonth, setCurrentRecordMonth] = useState<string>('');
  const [previousCalendarYear, setPreviousCalendarYear] = useState<string>('');
  const [previousFiscalYear, setPreviousFiscalYear] = useState<string>('');
  const [deficitStatus, setDeficitStatus] = useState<string>('');
  const [deficitDifPercent, setDeficitDifPercent] = useState<string>('');

  // shorten values that may be billions or trillions
  const getShortForm = (
    value: string,
    fractionDigits: number = 0,
    abbreviate: boolean = true
  ): string => {

    const trimmed = Math.abs(Number(value)).toFixed();
    const inTrillions = trimmed.length > 12;
    const divisor = inTrillions ? 1000000000000 : 1000000000;
    const appendix = inTrillions ? (abbreviate ? ' T' : ' trillion') :
      (abbreviate ? ' B' : ' billion');

    return Math.abs(
      (parseFloat(value) / divisor)).toFixed(fractionDigits) + appendix;
  }

  const getCurrentNationalDeficitData = (url) => {
    basicFetch(`${url}`)
    .then((res) => {
      if (res.data) {

        // create local variable to immediately find last complete year record
        const lastFiscalYear = (parseInt(res.data[0].record_fiscal_year) - 1).toString();
        const lastCompleteYearRecord =
          res.data.find(row => row.record_fiscal_year === lastFiscalYear);

        setPreviousFiscalYear(lastFiscalYear);
        setTextPreviousDeficit(
          getShortForm(lastCompleteYearRecord.current_fytd_net_outly_amt, 2, false));


        setPreviousCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());

        setDesktopDeficit(Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt)).toFixed());
        setMobilePriorDeficit(getShortForm(res.data[0].prior_fytd_net_outly_amt, 2));
        setDesktopPriorDeficit(numberWithCommas(
          parseFloat(Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)).toFixed())));
        const date = new Date();
        date.setMonth(parseInt(res.data[0].record_calendar_month) - 1);
        setCurrentRecordMonth(date.toLocaleString('en-US', {
          month: 'short',
        }));
        const currentDeficit = Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt));
        const priorYearDeficit = Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt));
        setDeficitDifPercent((
          ((currentDeficit - priorYearDeficit) / priorYearDeficit)*100).toFixed())
        if(currentDeficit > priorYearDeficit) {
          setDeficitStatus('increased');
        }
        else if (currentDeficit < priorYearDeficit) {
          setDeficitStatus('decreased');
        }
      }
    });
  };

  const formatDeficit = () => {
    if(typeof(window) !== 'undefined') {
      if (window.innerWidth < pxToNumber(breakpointLg)) {
        setDisplayedPriorDeficitValue(mobilePriorDeficit);
      }
      else {
        setDisplayedPriorDeficitValue(desktopPriorDeficit);
      }
    }
  }

  const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      const updateSize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    getCurrentNationalDeficitData(deficitUrl);
  }, []);

  useEffect(() => {
    formatDeficit();
  }, [useWindowSize(), []])

  const mtsLink =
    <CustomLink url={'/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government'}>
      Monthly Treasury Statement (MTS)
    </CustomLink>;
  const debt = <CustomLink url={'/national-debt/'}>Debt</CustomLink>;
  return (
    <>
      <p className={heroImageSubHeading}>A deficit occurs when the federal government’s
        spending exceeds its revenues. In fiscal year (FY) {previousFiscalYear}, the
        federal government spent ${textPreviousDeficit} more than it collected, resulting
        in a national deficit.
      </p>
      <div>
        <SplitFlapDisplay value={desktopDeficit}
                          precision={0}
                          minLength={15} // number of characters to initially display
                          valueType="currency"
        />
      </div>
      <div className={counterSourceInfo}>
        <p>
          Fiscal year-to-date (since October {previousFiscalYear}) total updated monthly using
          the {mtsLink} dataset.
        </p>
      </div>
      <div className={footNotes}>
        <p>
          Compared to the same period last year
          (Oct {previousFiscalYear} - {currentRecordMonth} {previousCalendarYear}),
          our national deficit has {deficitStatus}.
        </p>
      </div>
      <div className={deficitBoxContainer}>
        <div className={deficitBox}>
          ${displayedPriorDeficitValue}
        </div>
          {
            deficitStatus === 'increased' ? (
              <div className={deficitArrow}>
                <FontAwesomeIcon icon={faUpLong} title={"up arrow"} />
              </div>
            )
            : (
              <div className={deficitArrow}>
                <FontAwesomeIcon icon={faDownLong} title={"down arrow"} />
              </div>
            )
          }
        <div className={deficitBoxPercent}>
          {deficitDifPercent}%
        </div>
      </div>
      <div className={calloutContainer}>
        <div className={heroImageCallout} data-testid={"nationalDebtCallout"}>
          <FontAwesomeIcon icon={faFlagUsa} className={icon} />
          <p>
            This topic is the second of four U.S. government financial concepts from Your Guide to
            America’s Finances with more being added in the coming months. We’ll help you learn more
            about money coming in (Revenue), money going out (Spending), and the Deficit and {debt}.
          </p>
        </div>
      </div>
    </>
  )
}
export default NationalDeficitHero;
