import React, {useEffect, useLayoutEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {calloutContainer, counterSourceInfo, heroImageCallout, icon, footNotes, deficitBox, deficitBoxPercent, deficitBoxContainer, deficitArrow} from "../../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa, faDownLong, faUpLong} from "@fortawesome/free-solid-svg-icons";
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import {numberWithCommas} from "../../../../helpers/simplify-number/simplifyNumber";
import {pxToNumber} from "../../../../helpers/styles-helper/styles-helper";
import {breakpointLg} from "../../../../variables.module.scss";

const NationalDeficitHero = (): JSX.Element => {
  const fields: string = 'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,record_calendar_month,record_calendar_year,record_fiscal_year';
  const sort: string = 'sort=-record_date';
  const filter: string = 'filter=line_code_nbr:eq:5694'
  const pagination: string = 'page[size]=1';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const deficitUrl: string = `${apiPrefix}${endpointUrl}`;

  const [displayedDeficitValue, setDisplayedDeficitValue] =
    useState<string | null>(null);

  const [desktopDeficit, setDesktopDeficit] = useState<string | null>(null);
  const [mobileDeficit, setMobileDeficit] = useState<string | null>(null);
  const [currentRecordMonth, setCurrentRecordMonth] = useState<string>('');
  const [previousCalendarYear, setPreviousCalendarYear] = useState<string>('');
  const [currentFiscalYear, setCurrentFiscalYear] = useState<string>('');
  const [previousFiscalYear, setPreviousFiscalYear] = useState<string>('');
  const [deficitStatus, setDeficitStatus] = useState<string>('');
  const [deficitDifPercent, setDeficitDifPercent] = useState<string>('');

  const getCurrentNationalDeficitData = (url) => {
    basicFetch(`${url}`)
    .then((res) => {
      if (res.data) {
        setMobileDeficit(numberWithCommas(Math.abs(
          (parseFloat(res.data[0].prior_fytd_net_outly_amt) / 1000000000)).toFixed() + 'B'));
        setDesktopDeficit(numberWithCommas(
          parseFloat(Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)).toFixed())));
        const date = new Date();
        date.setMonth(parseInt(res.data[0].record_calendar_month) - 1);
        setCurrentRecordMonth(date.toLocaleString('en-US', {
          month: 'short',
        }));
        setCurrentFiscalYear((parseInt(res.data[0].record_fiscal_year) - 1).toString());
        setPreviousFiscalYear((parseInt(res.data[0].record_fiscal_year) - 2).toString());
        setPreviousCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());
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
        setDisplayedDeficitValue(mobileDeficit);
      }
      else {
        setDisplayedDeficitValue(desktopDeficit);
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
    <CustomLink url={'https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays-of-the-u-s-government'}>
      Monthly Treasury Statement (MTS)
    </CustomLink>;
  const debt = <CustomLink url={'/national-debt/'}>Debt</CustomLink>;
  return (
    <>
      <div>
        FLIP CARD PLACEHOLDER
      </div>
      <div className={counterSourceInfo}>
        <p>
          Fiscal year-to-date (since October {currentFiscalYear}) total updated monthly using
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
          ${displayedDeficitValue}
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
