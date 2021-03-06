import React from 'react';
import {
  render,
  act,
  waitForElementToBeRemoved,
  fireEvent
} from '@testing-library/react';
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
  VisualizingTheDebtAccordion,
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
  nationalDebtDescriptionAppendix,
} from "./national-debt"
import {
  mockFifthSectionValueMarkers,
  mockExplainerPageResponse,
  mockPublicDebtIncrease,
  mockGovtDebtIncrease,
  mockInterestRatesResponse,
  mockTotalDebtResponse,
  mockDebtBreakdownResponse,
  mockInterestToDebtChartHeaderSummary,
  mockInterestExpenseResponse,
  mockDebtExpenseResponse
} from "../../explainer-test-helper"
import {
  determineBEAFetchResponse, setGlobalFetchMatchingResponse,
  setGlobalFetchResponse,
} from "../../../../utils/mock-utils"
import { getYear } from 'date-fns';
import simplifyNumber from '../../../../helpers/simplify-number/simplifyNumber';
import { breakpointSm } from '../../../../variables.module.scss';

import {
  nationalDebtExplainedTable,
  growingNationalDebtSectionAccordion
} from './national-debt.module.scss';
import DataSourcesMethodologies from "../../data-sources-methodologies/data-sources-methodologies"
import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/dom"


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
  const glossary = [];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  it('renders the table showing a breakdown of how the national debt works', () => {
    const { container, getByText } = render(<NationalDebtExplainedSection glossary={glossary}/>);

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
  const glossary = [];
  const mockCpiDataset = {
    "2011": "10",
    "2012": "5",
    "2013": "5",
    "2020": "15",
    "2021": "15"
  };


  beforeEach(() => {
    determineBEAFetchResponse(jest, mockExplainerPageResponse);
    jest.spyOn(console, 'warn').mockImplementation(() => {});

  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  it('renders the Visualizing the Debt table inside an accordion', async () => {
    const { container } = render(
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary} cpiDataByYear={mockCpiDataset}/>
    );

    expect(await container.querySelector(`.${growingNationalDebtSectionAccordion}`))
      .toBeInTheDocument();
  })

  it('shows the correct amount of rows and columns for different screen sizes', async () => {
    const { findByTestId, findAllByTestId, rerender } = render(
      <VisualizingTheDebtAccordion width={breakpointSm} />
    );
    fireEvent.click(await findByTestId('button'));
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
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary} cpiDataByYear={mockCpiDataset}/>
    );

    expect(await findByTestId('chart')).toBeInTheDocument();
  })

  it('contains the debt trends line chart', async () => {
    const { findByTestId } = render(
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary} cpiDataByYear={mockCpiDataset}/>
    );

    expect(await findByTestId('debtTrendsChart')).toBeInTheDocument();
  })

  it('displays the latest date and value', async () => {
    const latestDate = getYear(new Date(mockExplainerPageResponse.data[0][config.dateField]));
    const latestValue = simplifyNumber(mockExplainerPageResponse.data[0][config.valueField], true);

    const { findAllByText, findByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary} cpiDataByYear={mockCpiDataset}/>
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
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
    );

    expect(await findByTestId('breakdownChart')).toBeInTheDocument();
  });

  it('makes the api call with a correctly configured query string', async () => {

    // mock current date because the query string is formulated based on current date
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      return new Date(new Date(2021, 11, 1, 12).valueOf());
    });
    render(
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
    );

    const queryString = '?fields=debt_held_public_mil_amt,intragov_hold_mil_amt,' +
      'record_calendar_year,record_calendar_month,record_date&filter=record_calendar_month' +
      ':in:(12,11,10),record_calendar_year:in:(2021,2011),security_type_desc:eq:' +
      'Total%20Public%20Debt%20Outstanding&sort=record_date&limit=12';
    expect(global.fetch.mock.calls[0][0]).toContain(queryString);
  });

  it('displays the correct years and values', async () => {
    const latestYear =
      mockDebtBreakdownResponse.data[mockDebtBreakdownResponse.data.length - 1]
        .record_calendar_year;
    const firstYear = latestYear - 10;

    const { findByText, findAllByText, findByTestId } = render(
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
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
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
    );

    expect(await findByTestId('multichart')).toBeInTheDocument();
  });

  it('contains a title for the multichart with correct date values', async () => {
    const { findByText } = render(
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
    );

    expect(await findByText('Interest Rate and Total Debt, 2012 ??? 2021')).toBeInTheDocument();
  });

  it('contains a header for the multichart with correct default values', async () => {
    const { getByTestId } = render(
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
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
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
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
      <DebtBreakdownSection sectionId={sectionId} glossary={glossary}/>
    );
    expect(await findByText('Last Updated: September 30, 2021')).toBeInTheDocument();
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

describe('Data Sources & Methodologies', () => {
  it('contains content for a Data sources and methodologies section', async () => {
    const { findByText, getByRole} = render(
      <DataSourcesMethodologies>{nationalDebtDataSources}</DataSourcesMethodologies>
    );
    const toggle = getByRole('button');
    act(() => {
      toggle.click();
    });


    const accordionContentsSegment =
      await findByText('Bureau of Economic Analysis');
    expect(accordionContentsSegment)
      .toBeInTheDocument();
  });
});

describe('Visualing the debt accordion values', () => {

  beforeEach(() => {
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      {
        "data": [{
          "tot_pub_debt_out_amt": "28908004857445.12",
          "record_date": "2021-12-13"
        }]
      })
  });

  it("makes api call for debt data", async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    const {getByText} = render(<VisualizingTheDebtAccordion />);
    expect(fetchSpy).toBeCalled();
    await waitForElementToBeRemoved(() => getByText(/99999999999999.99/i));
    expect(
      await getByText("Visualizing the debt - How much is $29 trillion dollars?", {exact: false}))
      .toBeInTheDocument();
    global.fetch.mockRestore();
  });

});

describe('SEO Description Generator', () => {

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockRestore();
  });

  it("makes api call for debt data and returns formatted description", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () =>
          Promise.resolve({
            data: [{
              'tot_pub_debt_out_amt': "28908004857445.12",
              'record_date': "2021-12-13"
            }]
          })
      }));

    const fetchSpy = jest.spyOn(global, 'fetch');
    const result = await nationalDebtDescriptionGenerator();
    expect(fetchSpy.mock.calls[0][0])
      .toContain('/debt_to_penny?fields=tot_pub_debt_out_amt,record_date&sort=-record_date');
    expect(result)
      .toStrictEqual('The federal government currently has $28.91 trillion in federal debt. ' +
      nationalDebtDescriptionAppendix);
  });

  it("makes api call for debt data and handles api failure", async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () =>
          Promise.resolve({
            "ERROR": "Mock error condition from API"
          })
      }));

    const result = await nationalDebtDescriptionGenerator();
    expect(result).toStrictEqual(nationalDebtDescriptionAppendix);
  });
});
