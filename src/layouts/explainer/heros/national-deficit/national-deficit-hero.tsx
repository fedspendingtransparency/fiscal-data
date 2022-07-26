import React from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import {calloutContainer, counterSourceInfo, heroImageCallout, icon, footNotes} from "../../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa} from "@fortawesome/free-solid-svg-icons";

const NationalDeficitHero = (): JSX.Element => {
  const mtsLink =
    <CustomLink url={'https://fiscaldata.treasury.gov/datasets/monthly-treasury-statement/' +
       'summary-of-receipts-and-outlays-of-the-u-s-government'}>Monthly Treasury Statement (MTS)
    </CustomLink>;
  const debt = <CustomLink url={'/national-debt/'}>Debt</CustomLink>;
  return (
    <>
      <div className={counterSourceInfo}>
        <p>
          Fiscal year-to-date (since October YYYY (current FY)) total updated monthly using
          the {mtsLink} dataset.
        </p>
      </div>
      <div className={footNotes}>
        <p>
          Compared to the same period last year (Oct YYYY (prior FY) - Mon YYYY (current month and
          prior FY)), our national deficit has increased/decreased.
        </p>
      </div>
      <div className={calloutContainer}>
        <div className={heroImageCallout} data-testid={"nationalDebtCallout"}>
          <FontAwesomeIcon icon={faFlagUsa} className={icon}/>
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
