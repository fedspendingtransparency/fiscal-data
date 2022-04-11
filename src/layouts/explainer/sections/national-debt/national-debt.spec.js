import React from 'react';
import { render } from '@testing-library/react';
import nationalDebtSections, {
  nationalDebtSectionIds,
  nationalDebtSectionConfigs,
  NationalDebtExplainedSection,
  nationalDebtExplainedTableContent,
  visualizingTheDebtTableContent,
  GrowingNationalDebtSection,
  DebtBreakdownSection,
  DebtCeilingSection,
  debtCeilingSectionAccordionTitle,
  DiveDeeperSection,
  diveDeeperAccordionTitle, VisualizingTheDebtAccordion
} from './national-debt';
import {
  mockFifthSectionValueMarkers,
  mockExplainerPageResponse,
  mockFifthSectionResponse,
  mockPublicDebtIncrease,
  mockGovtDebtIncrease
} from '../../explainer-test-helper';
import { setGlobalFetchResponse } from '../../../../utils/mock-utils';
import { getYear } from 'date-fns';
import simplifyNumber from '../../../../helpers/simplify-number/simplifyNumber';
import { breakpointSm } from '../../../../variables.module.scss';

import {
  nationalDebtExplainedTable,
  growingNationalDebtSectionAccordion
} from './national-debt.module.scss';

jest.mock('./variables.module.scss', (content) => ({
  ...content,
  breakpointSm: 600
}));

describe('National Debt explainer page sections', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockExplainerPageResponse);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('returns 8 sections with headings and body components', () => {
    expect(nationalDebtSections.length).toBe(8);
    expect(nationalDebtSections[0].title).toBeDefined();
  });
});

describe('National Debt Explained', () => {
  it('renders the table showing a breakdown of how the national debt works', () => {
    const { container, getByText } = render(<NationalDebtExplainedSection />);

    expect(container.querySelector(`.${nationalDebtExplainedTable}`)).toBeInTheDocument();

    nationalDebtExplainedTableContent.body.forEach((row) => {
      row.forEach((col) => {
        if (col !== null) {
          expect(getByText(col)).toBeInTheDocument();
        }
      });
    });
  });

});

describe('The Growing National Debt', () => {
  const sectionId = nationalDebtSectionIds[3];
  const config = nationalDebtSectionConfigs[sectionId]
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockExplainerPageResponse);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the Visualizing the Debt table inside an accordion', async () => {
    const { container } = render(
      <GrowingNationalDebtSection sectionId={sectionId} />
    );

    expect(await container.querySelector(`.${growingNationalDebtSectionAccordion}`)).toBeInTheDocument();
  })

  it('shows the correct amount of rows and columns for different screen sizes', async () => {
    const { findAllByTestId, rerender } = render(
      <VisualizingTheDebtAccordion width={breakpointSm} />
    );

    const rowsDesktop = await findAllByTestId('accordion-table-row');
    expect(rowsDesktop).toHaveLength(visualizingTheDebtTableContent.desktop.rows);
    rerender(
      <VisualizingTheDebtAccordion width={breakpointSm-1} />
    );

    const rowsMobile = await findAllByTestId('accordion-table-row');
    expect(rowsMobile).toHaveLength(visualizingTheDebtTableContent.mobile.rows);
  });


  it('contains the chart', async () => {
    const { findByTestId } = render(
      <GrowingNationalDebtSection sectionId={sectionId} />
    );

    expect(await findByTestId('chart')).toBeInTheDocument();
  })

  it('displays the latest date and value', async () => {
    const latestDate = getYear(new Date(mockExplainerPageResponse.data[0][config.dateField]));
    const latestValue = simplifyNumber(mockExplainerPageResponse.data[0][config.valueField], true);

    const { findAllByText, findByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId} />
    );

    // Latest year is also the text content for the last value on the graph's x-axis
    const dateComponents = await findAllByText(latestDate);
    expect(dateComponents[0]).toBeInTheDocument();

    const valueComponent = await findByText(latestValue);
    expect(valueComponent).toBeInTheDocument();
  });
});

describe('Breaking Down the Debt', () => {
  const sectionId = nationalDebtSectionIds[4];

  beforeEach(() => {
    setGlobalFetchResponse(jest, mockFifthSectionResponse);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('contains the chart', async () => {
    const { findByTestId } = render(
      <DebtBreakdownSection sectionId={sectionId} />
    );

    expect(await findByTestId('breakdownChart')).toBeInTheDocument();
  });

  it('makes the api call with a correctly configured query string', async () => {

    // mock current date because the query string is formulated based on current date
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 11, 1, 12).valueOf());
    });
    render(
      <DebtBreakdownSection sectionId={sectionId} />
    );

    const queryString = '?fields=debt_held_public_mil_amt,intragov_hold_mil_amt,' +
      'record_calendar_year,record_calendar_month,record_date&filter=record_calendar_month' +
      ':in:(12,11,10),record_calendar_year:in:(2021,2011),security_type_desc:eq:' +
      'Total%20Public%20Debt%20Outstanding&sort=record_date&limit=12';
    expect(global.fetch.mock.calls[0][0]).toContain(queryString);
  });

  it('displays the correct years and values', async () => {
    const latestYear =
      mockFifthSectionResponse.data[mockFifthSectionResponse.data.length - 1].record_calendar_year;
    const firstYear = latestYear - 10;

    const { findByText, findAllByText, findByTestId } = render(
      <DebtBreakdownSection sectionId={sectionId} />
    );

    // Latest year is in the component
    const latestYearEntries = await findAllByText(latestYear);
    expect(latestYearEntries[0]).toBeInTheDocument();

    // First year is in the component
    const firstYearEntries = await findAllByText(firstYear);
    expect(firstYearEntries[0]).toBeInTheDocument();

    // value markers are in the component
    for (const mockVal of mockFifthSectionValueMarkers) {
      expect(await findByText(mockVal)).toBeInTheDocument();
    }

    // calculated percentages are in the component
    expect(await findByTestId('public-debt-increase')).toHaveTextContent(mockPublicDebtIncrease);
    expect(await findByTestId('govt-debt-increase')).toHaveTextContent(mockGovtDebtIncrease);
  });
});

describe('The Debt Ceiling', () => {
  it('contains an accordion', () => {
    const { getByText } = render(
      <DebtCeilingSection />
    );

    expect(getByText(debtCeilingSectionAccordionTitle)).toBeInTheDocument();
  });
});

describe('Dive Deeper', () => {
  it('contains an accordion for data sources and methodologies', () => {
    const { getByText } = render(
      <DiveDeeperSection />
    );

    expect(getByText(diveDeeperAccordionTitle)).toBeInTheDocument();
  });
});
