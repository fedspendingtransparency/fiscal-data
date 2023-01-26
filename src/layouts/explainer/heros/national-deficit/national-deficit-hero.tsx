import React, {useEffect, useLayoutEffect, useState} from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {
  counterSourceInfo,
  footNotes,
  deficitBoxContainer,
  heroImageSubHeading,
  deficit
} from "../../hero-image/hero-image.module.scss"
import {apiPrefix, basicFetch} from "../../../../utils/api-utils";
import SplitFlapDisplay from "../../../../components/split-flap-display/split-flap-display"
import GlossaryTerm from "../../../../components/glossary-term/glossary-term";
import {getFootNotesDateRange, getPillData, getShortForm} from "../hero-helper";

const NationalDeficitHero = ({glossary}): JSX.Element => {
  const fields: string = 'fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt,record_date,' +
    'record_calendar_month,record_calendar_year,record_fiscal_year';
  const sort: string = 'sort=-record_date';
  const filter: string = 'filter=line_code_nbr:eq:5694'
  const pagination: string = 'page[size]=13';
  const endpointUrl: string
    = `v1/accounting/mts/mts_table_5?${fields}&${filter}&${sort}&${pagination}`;
  const deficitUrl: string = `${apiPrefix}${endpointUrl}`;

  const deficitPillColor = '#b3532d1a';

  const rightPillTooltipHoverText = 'The percentage change in the deficit compared to the same period last year, in trillions $USD.';


  const [textCurrentDeficit, setTextCurrentDeficit] = useState<string | null>(null);
  const [desktopDeficit, setDesktopDeficit] = useState<string | null>(null);
  const [desktopPriorDeficit, setDesktopPriorDeficit] = useState<string | null>(null);
  const [currentRecordMonth, setCurrentRecordMonth] = useState<string>('');
  const [previousCalendarYear, setPreviousCalendarYear] = useState<string>('');
  const [previousFiscalYear, setPreviousFiscalYear] = useState<string>('');
  const [currentFiscalYear, setCurrentFiscalYear] = useState<string>('')

  // calendar year in which prior fiscal year began (PreviousFiscalYear - 1);
  const [previousFiscalStartYear, setPreviousFiscalStartYear] = useState<string>('');

  const [deficitStatus, setDeficitStatus] = useState<string>('');
  const [deficitDif, setDeficitDif] = useState<string>('');
  const [deficitDifPill, setDeficitDifPill] = useState<number>(0);
  const [deficitDifPercent, setDeficitDifPercent] = useState<number>(0);


  const getCurrentNationalDeficitData = (url) => {
    basicFetch(`${url}`)
    .then((res) => {
      if (res.data) {


        // create local variable to immediately find last complete year record
        const lastFiscalYear = (Number(res.data[0].record_fiscal_year) - 1).toString();
        setCurrentFiscalYear(res.data[0].record_fiscal_year);

        setPreviousFiscalYear(lastFiscalYear);
        setPreviousFiscalStartYear((Number(lastFiscalYear) - 1).toString())

        setTextCurrentDeficit(
          getShortForm(res.data[0].current_fytd_net_outly_amt, 2,  false, true)
        )

        setPreviousCalendarYear((parseInt(res.data[0].record_calendar_year) - 1).toString());

        setDesktopDeficit(Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt)).toFixed());
        if (Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)) < 1000000000000) {
          setDesktopPriorDeficit(getShortForm(
            Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)).toFixed(), 0, false));
        }
        else if (Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)) >= 1000000000000) {
          setDesktopPriorDeficit(getShortForm(
            Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt)).toFixed(), 2, false));
        }
        const date = new Date();
        date.setDate(15);
        date.setMonth(parseInt(res.data[0].record_calendar_month) - 1);
        setCurrentRecordMonth(res.data[0].record_calendar_month);
        const currentDeficit = Math.abs(parseFloat(res.data[0].current_fytd_net_outly_amt));
        const priorYearDeficit = Math.abs(parseFloat(res.data[0].prior_fytd_net_outly_amt));
        setDeficitDif(getShortForm(Math.abs(priorYearDeficit - currentDeficit).toString(), 0, false));
        setDeficitDifPill(Math.abs(priorYearDeficit - currentDeficit));
        setDeficitDifPercent(parseFloat((((currentDeficit - priorYearDeficit) / priorYearDeficit)*100).toFixed()))
        if(currentDeficit > priorYearDeficit) {
          setDeficitStatus('increased');
        }
        else if (currentDeficit < priorYearDeficit) {
          setDeficitStatus('decreased');
        }
      }
    });
  };

  useEffect(() => {
    getCurrentNationalDeficitData(deficitUrl);
  }, []);

  const mtsLink = (
    <CustomLink
      url={
        "/datasets/monthly-treasury-statement/summary-of-receipts-and-outlays" +
        "-of-the-u-s-government"
      }
      eventNumber="2"
    >
      Monthly Treasury Statement (MTS)
    </CustomLink>
  );

  const fiscalYear =
    <GlossaryTerm term={'fiscal year'} page={'Deficit Explainer'} glossary={glossary} >
      fiscal year (FY)
    </GlossaryTerm>

  const changeNationaDeficitFooter =
    <p>Compared to the national deficit of ${desktopPriorDeficit} for the same period last year
      ({getFootNotesDateRange(previousFiscalYear, previousCalendarYear, currentRecordMonth)}),
      our national deficit has {deficitStatus} by ${deficitDif}.
    </p>

  return (
    <>
      <p className={`${heroImageSubHeading} ${deficit}`}>A deficit occurs when the
        federal government’s spending exceeds its revenues. The federal government has
        spent ${textCurrentDeficit}{' '} more than it has collected in {fiscalYear}{' '}
        {currentFiscalYear}, resulting in a national deficit.
      </p>
      <div>
        <SplitFlapDisplay value={desktopDeficit}
                          mobilePrecision={parseInt(desktopDeficit) > 999999999999 ? 2 : 0}
                          minLength={desktopDeficit?.toString().length} // number of characters to initially display
                          valueType="currency"
        />
      </div>
      <div className={`${counterSourceInfo} ${deficit}`}>
        <p>
          Fiscal year-to-date (since October {previousFiscalYear}) total updated monthly using
          the {mtsLink} dataset.
        </p>
      </div>
      <div className={footNotes}>
        {changeNationaDeficitFooter}
      </div>
      <div className={deficitBoxContainer}>
        {
          getPillData(deficitDifPill, deficitDifPercent, deficitStatus, true, deficitPillColor,
          `The total amount the deficit has ${deficitStatus} compared to the same period last year, in trillions $USD.`,
            rightPillTooltipHoverText)
        }
      </div>
    </>
  )
}
export default NationalDeficitHero;
