import React, { FunctionComponent } from "react";
import Accordion from "../../../components/accordion/accordion";
import { section } from "./data-sources-methodologies.module.scss";

type DsmProps = {
  children?: React.ReactNode;
  pageName?: string;
};

const analyticsEventMap: Record<
  string,
  { openEventNumber: string; closeEventNumber?: string; explainerGAEvent: string }
> = {
  "national-debt": {
    openEventNumber: "40",
    closeEventNumber: "41",
    explainerGAEvent: "DebtExplainer"
  },
  "national-deficit": {
    openEventNumber: "26",
    closeEventNumber: "27",
    explainerGAEvent: "DeficitExplainer"
  },
  "federal-spending": {
    openEventNumber: "22",
    explainerGAEvent: "SpendingExplainer"
  },
  "government-revenue": {
    openEventNumber: "23",
    explainerGAEvent: "RevenueExplainer"
  },
  "afg-overview": {
    openEventNumber: "8",
    explainerGAEvent: "AfgOverview"
  }
};

const DataSourcesMethodologies: FunctionComponent<DsmProps> = ({
  children,
  pageName,
}: DsmProps) => {
  const analyticsProps = analyticsEventMap[pageName];
  // TODO: Accordion prop types need to match
  return (
    <section className={`${section} dataSourceAccordion`}>
      <Accordion {...analyticsProps} title="Data Sources & Methodologies" ga4ID={'DSM'}>
        {children}
      </Accordion>
    </section>
  );
};

export default DataSourcesMethodologies;
