import GlossaryPopoverDefinition from "../../../../../components/glossary/glossary-term/glossary-popover-definition";
import {
  icon,
  iconBackground,
  keyTakeawaysContent,
  noMarginBottom,
  offsetIcon
} from "../national-debt.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faMoneyCheckDollar, faPeopleCarry} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export const KeyTakeawaysSection = ({ glossary, glossaryClickHandler }) => {
  const nonMarketableSecurities = (
    <GlossaryPopoverDefinition
      term="Non-Marketable Securities"
      page="Debt explainer"
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      non-marketable
    </GlossaryPopoverDefinition>
  );
  const marketableSecurities = (
    <GlossaryPopoverDefinition
      term="Marketable Securities"
      page="Debt explainer"
      glossary={glossary}
      glossaryClickHandler={glossaryClickHandler}
    >
      marketable
    </GlossaryPopoverDefinition>
  );

  return (
    <>
      <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faMoneyCheckDollar} className={icon} />
          <FontAwesomeIcon icon={faMoneyCheckDollar} className={offsetIcon} />
        </div>
        <p>
          The national debt is composed of distinct types of debt, similar to an
          individual whose debt may consist of a mortgage, car loan, and credit
          cards. The different types of debt include {nonMarketableSecurities}{" "}
          or {marketableSecurities} securities and whether it is debt held by
          the public or debt held by the government itself (known as
          intragovernmental).
        </p>
      </div>
      <div className={keyTakeawaysContent}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faChartLine} className={icon} />
          <FontAwesomeIcon icon={faChartLine} className={offsetIcon} />
        </div>
        <p>
          The U.S. has carried debt since its inception. Debts incurred during
          the American Revolutionary War amounted to $75 million, primarily
          borrowed from domestic investors and the French Government for war
          materials.
        </p>
      </div>
      <div className={`${keyTakeawaysContent} ${noMarginBottom}`}>
        <div className={iconBackground}>
          <FontAwesomeIcon icon={faPeopleCarry} className={icon} />
          <FontAwesomeIcon icon={faPeopleCarry} className={offsetIcon} />
        </div>
        <p>
          The national debt enables the federal government to pay for important
          programs and services for the American public.
        </p>
      </div>
    </>
  );
};
