import React, { ReactElement } from 'react';
import { analyticsEventHandler, featuredContentCitationsMap } from '../../featured-content-helpers';
import GlossaryPopoverDefinition from '../../../../components/glossary/glossary-term/glossary-popover-definition';

export const GettingStartedBody = (): ReactElement => {
  const { datasetSearchLink, debtLink, federalSpendingLink, savingsBondsLink, interestExpenseInsightLink } = featuredContentCitationsMap[
    'getting-started'
  ];

  const metadata = (
    <GlossaryPopoverDefinition
      term="Metadata"
      page="Getting Started on Fiscal Data"
      handleClick={() => analyticsEventHandler('Getting Started on Fiscal Data', 'Metadata', 'Glossary Term Click')}
    >
      metadata
    </GlossaryPopoverDefinition>
  );

  return (
    <div>
      <p>
        While there is a long history of publishing U.S. government financial reports for the public, these reports were often on various websites and
        weren’t always in a format that allowed users to easily analyze or understand them. Fiscal Data adds {metadata} to help you understand the
        data better and has converted all the data into a format that allows both people and computers to analyze the data.
      </p>
      <p>
        To explore or analyze the data, click on the {datasetSearchLink} option in the navigation at the top of the page. If you know the specific
        report or dataset you’re interested in, you can search for it in the search bar. If you’re just interested in exploring, using the Topics
        filter is a great way to discover new datasets.
      </p>
      <p>
        If you would rather learn more about federal finances without diving directly into the data yourself, check out any of our explainers or
        insights. Our explainers use charts and other visualizations to explain topics like {debtLink}, {federalSpendingLink}, or {savingsBondsLink},
        while our shorter insights pages provide a quick view into a topic like the {interestExpenseInsightLink}.
      </p>
    </div>
  );
};
