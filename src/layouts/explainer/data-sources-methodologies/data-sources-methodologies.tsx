import React, { FunctionComponent } from "react"
import Accordion from "../../../components/accordion/accordion";
import { section } from "./data-sources-methodologies.module.scss";

type DsmProps = {
  children?: React.ReactNode;
};

const DataSourcesMethodologies: FunctionComponent<DsmProps> = ({children}: DsmProps) => {
  return (
    <section className={`${section} dataSourceAccordion`}>
      <Accordion title="Data Sources & Methodologies">
        {children}
      </Accordion>
    </section>
  );
};

export default DataSourcesMethodologies;
