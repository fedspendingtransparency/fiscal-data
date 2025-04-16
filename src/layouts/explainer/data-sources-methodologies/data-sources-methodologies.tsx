import React, { FunctionComponent } from 'react';
import Accordion from '../../../components/accordion/accordion';
import { section } from './data-sources-methodologies.module.scss';
import { analyticsEventHandler } from '../explainer-helpers/explainer-helpers';

type DsmProps = {
  children?: React.ReactNode;
  pageName?: string;
};

const analyticsEventMap: Record<string, { openEventNumber?: string; explainerGAEvent?: string; onOpen?: () => void }> = {
  'national-debt': {
    openEventNumber: '40',
    explainerGAEvent: 'DebtExplainer',
  },
  'national-deficit': {
    openEventNumber: '26',
    explainerGAEvent: 'DeficitExplainer',
  },
  'federal-spending': {
    openEventNumber: '22',
    explainerGAEvent: 'SpendingExplainer',
  },
  'government-revenue': {
    openEventNumber: '23',
    explainerGAEvent: 'RevenueExplainer',
  },
  'afg-overview': {
    openEventNumber: '8',
    explainerGAEvent: 'AfgOverview',
  },
  'treasury-savings-bonds': {
    onOpen: () => analyticsEventHandler('Savings Bonds - DS&M', 'Accordion Expand Click'),
  },
};

const DataSourcesMethodologies: FunctionComponent<DsmProps> = ({ children, pageName }: DsmProps) => {
  const analyticsProps = analyticsEventMap[pageName];
  // TODO: Accordion prop types need to match
  return (
    <section className={`${section} dataSourceAccordion`}>
      <Accordion {...analyticsProps} title="Data Sources & Methodologies" ga4ID="DSM" dataTestId="DSM_content">
        {children}
      </Accordion>
    </section>
  );
};

export default DataSourcesMethodologies;
