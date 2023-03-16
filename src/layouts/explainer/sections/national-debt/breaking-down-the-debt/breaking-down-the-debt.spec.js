import { nationalDebtSectionIds} from "../national-debt";
import {setGlobalFetchMatchingResponse} from "../../../../../utils/mock-utils";
import {
  mockDebtBreakdownResponse,
  mockDebtExpenseResponse,
  mockFifthSectionValueMarkers, mockGovtDebtIncrease,
  mockInterestExpenseResponse,
  mockInterestRatesResponse, mockInterestToDebtChartHeaderSummary, mockPublicDebtIncrease,
  mockTotalDebtResponse
} from "../../../explainer-test-helper";
import {render} from "@testing-library/react";
import {waitFor} from "@testing-library/dom";
import Analytics from "../../../../../utils/analytics/analytics";
import BreakingDownTheDebt from "./breaking-down-the-debt";

import React from "react";

describe('Breaking Down the Debt', () => {
  const sectionId = nationalDebtSectionIds[4];
  const glossary = [];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, [
      {
        matcher: (url) => {
          return url.includes('mspd_table_1?fields');
        },
        jsonResponse: mockDebtBreakdownResponse
      },
      {
        matcher: (url) => {
          return url.includes('mspd_table_1?filter');
        },
        jsonResponse: mockTotalDebtResponse
      },
      {
        matcher: (url) => { return url.includes('avg_interest_rates');},
        jsonResponse: mockInterestRatesResponse
      },
      {
        matcher: (url) => {
          return url.includes('interest_expense');
        },
        jsonResponse: mockInterestExpenseResponse
      },
      {
        matcher: (url) => {
          return url.includes('mts_table_5?fields');
        },
        jsonResponse: mockDebtExpenseResponse
      }
    ]);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('contains the chart', async () => {
    const { findByTestId } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    expect(await findByTestId('breakdownChart')).toBeInTheDocument();
  });

  it('makes the api call with a correctly configured query string', async () => {

    // mock current date because the query string is formulated based on current date
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 11, 1, 12).valueOf());
    });
    render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    const queryString = '?fields=debt_held_public_mil_amt,intragov_hold_mil_amt,' +
      'record_calendar_year,record_calendar_month,record_date&filter=record_calendar_month' +
      ':in:(12,11,10),record_calendar_year:in:(2021,2011),security_type_desc:eq:' +
      'Total%20Public%20Debt%20Outstanding&sort=record_date&limit=12';
    expect(global.fetch.mock.calls[2][0]).toContain(queryString);
  });

  it('displays the correct years and values', async () => {
    const latestYear =
      mockDebtBreakdownResponse.data[mockDebtBreakdownResponse.data.length - 1]
        .record_calendar_year;
    const firstYear = latestYear - 10;

    const { findByText, findAllByText, findByTestId } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
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

  it('contains a multichart', async () => {
    const { findByTestId } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    expect(await findByTestId('multichart')).toBeInTheDocument();
  });

  it('contains a title for the multichart with correct date values', async () => {
    const { findByText } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    expect(await findByText('Interest Rate and Total Debt, 2012 – 2021')).toBeInTheDocument();
  });

  it('contains a header for the multichart with correct default values', async () => {
    const { getByTestId } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    let elem;
    await waitFor(() => {
      elem = getByTestId('interest-and-debt-chart-header');
      Object.entries(mockInterestToDebtChartHeaderSummary)
        .forEach(([label, value]) => {

            console.log('label', label);
            expect(elem).toHaveTextContent(label);
            expect(elem).toHaveTextContent(value);
          }
        )
    });
  });

  it('contains a legend for items represented in the multichart', async () => {
    const { getByTestId } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );
    let elem;
    await waitFor(() => {
      elem = getByTestId('interest-and-debt-chart-legend')
      expect(elem).toHaveTextContent('Average Interest Rate');
      expect(elem).toHaveTextContent('Total Debt');
    });
  });

  it('contains a last-updated text string', async () => {
    const { findByText } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );
    expect(await findByText('Last Updated: September 30, 2021')).toBeInTheDocument();
  });


  it('calls the appropriate analytics event when links are clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <BreakingDownTheDebt sectionId={sectionId} glossary={glossary} />
    );

    const mspd = await waitFor(() => getByText(
      'U.S. Treasury Monthly Statement of the Public Debt (MSPD)'));
    const averageInterestRates = await waitFor(() => getByText(
      'Average Interest Rates on U.S. Treasury Securities'));

    mspd.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Intragovernmental Holdings and Debt Held by the Public'
    });
    spy.mockClear();

    averageInterestRates.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Interest Rate and Total Debt'
    });
    spy.mockClear();

  });
});
