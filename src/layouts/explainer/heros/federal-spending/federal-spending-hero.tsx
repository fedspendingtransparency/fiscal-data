import {footNotes, heroImageCallout, heroImageSubHeading, icon} from "../../hero-image/hero-image.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlagUsa} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import CustomLink from "../../../../components/links/custom-link/custom-link";


const FederalSpendingHero = (): JSX.Element => {
  const debt = <CustomLink url={'/national-debt/'}>Debt</CustomLink>;
  const deficit = <CustomLink url={'/national-deficit/'}>Deficit</CustomLink>;

  return (
    <>
      <p className={heroImageSubHeading}>
        The U.S. government has spent ($XX.X total spending) in fiscal year 2022 to ensure the
        well-being of the people of the United States.
      </p>
      <div>
        Flip card placeholder
      </div>
      <div className={footNotes}>
        <p>
          Footnotes placeholder
        </p>
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
