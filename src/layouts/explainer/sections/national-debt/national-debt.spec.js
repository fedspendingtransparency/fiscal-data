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
  visualizingTheDebtTableContent,
  GrowingNationalDebtSection,
  DebtBreakdownSection,
  DebtCeilingSection,
  debtCeilingSectionAccordionTitle,
  VisualizingTheDebtAccordion,
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
  nationalDebtDescriptionAppendix,
  FundingProgramsSection, DebtTrackingSection, DiveDeeperSection
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
  mockDebtExpenseResponse, mockBeaGDPData
} from "../../explainer-test-helper"
import {
  determineBEAFetchResponse, setGlobalFetchMatchingResponse,
  setGlobalFetchResponse,
} from "../../../../utils/mock-utils"
import { getYear } from 'date-fns';
import simplifyNumber from '../../../../helpers/simplify-number/simplifyNumber';
import { breakpointSm } from '../../../../variables.module.scss';

import {
  growingNationalDebtSectionAccordion
} from './national-debt.module.scss';
import DataSourcesMethodologies from "../../data-sources-methodologies/data-sources-methodologies"
import fetchMock from "fetch-mock";
import { waitFor } from "@testing-library/dom"
import Analytics from "../../../../utils/analytics/analytics";


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


describe('Funding Programs & Services', () => {
  it('calls the appropriate analytics event when links are clicked on', () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText, getAllByText } = render(<FundingProgramsSection />);


    const accordion = getByText('What are some of the major spending categories?');
    accordion.click();
    const usaSpending = getAllByText('USAspending.gov');
    const objectClass = getByText('Object Class');
    const budgetFunction = getByText('Budget Function');

    usaSpending[1].click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Funding Programs & Services'
    });
    spy.mockClear();

    usaSpending[0].click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - What are the major spending categories?'
    });
    spy.mockClear();

    objectClass.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - What are the major spending categories?'
    });
    spy.mockClear();

    budgetFunction.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - What are the major spending categories?'
    });
    spy.mockClear();
  });
});

jest.mock('../../../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
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
      <GrowingNationalDebtSection sectionId={sectionId} glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
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
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    expect(await findByTestId('chart')).toBeInTheDocument();
  })



  it('displays the latest date and value', async () => {
    const latestDate = getYear(new Date(mockExplainerPageResponse.data[0][config.dateField]));
    const latestValue = simplifyNumber(mockExplainerPageResponse.data[0][config.valueField], true);

    const { findAllByText, findByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    // Latest year is also the text content for the last value on the graph's x-axis
    const dateComponents = await findAllByText(latestDate);
    expect(dateComponents[0]).toBeInTheDocument();

    const valueComponent = await findByText(latestValue);
    expect(valueComponent).toBeInTheDocument();
  });

  it('calls the appropriate analytics event when links are clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText, getAllByText } = render(
      <GrowingNationalDebtSection sectionId={sectionId}
                                  glossary={glossary}
                                  cpiDataByYear={mockCpiDataset}
      />
    );

    const historicalDebt = await waitFor(() => getAllByText('Historical Debt Outstanding')[0]);
    const bls = await waitFor(() => getByText('Bureau of Labor Statistics'));

    historicalDebt.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years'
    });
    spy.mockClear();

    bls.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - U.S. Federal Debt Trends Over the Last 100 Years'
    });
    spy.mockClear();
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

describe('Tracking the debt', () => {
  it('calls the appropriate analytics event when link is clicked on',  () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <DebtTrackingSection />
    );

    const fiscalService = getByText('Bureau of the Fiscal Service');

    fiscalService.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - Tracking the Debt'
    });
    spy.mockClear();

  });
})

describe('Dive deeper into the debt', () => {
  it('calls the appropriate analytics event when links are clicked on',  () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText } = render(
      <DiveDeeperSection />
    );

    const financialReport = getByText('FRUSG_2021.pdf', {exact:false});
    const americasFiscalFuture = getByText('americas-fiscal-future', {exact:false});
    const debtCeiling = getByText('whitehouse.gov/cea', {exact:false});
    const federalBorrowing = getByText('whitehouse.gov/wp-content', {exact:false});
    const federalNetInterestCost = getByText('cbo.gov/publication/56910', {exact:false});
    const treasurySecurities = getByText('federalreserve.gov', {exact:false});
    const reducingDeficit = getByText('cbo.gov/publication/56783', {exact:false});
    const treasuryBulletin = getByText('treasury-bulletin', {exact:false});
    const usaSpending = getByText('usaspending.gov', {exact:false});

    const resources = [financialReport, americasFiscalFuture, debtCeiling, federalBorrowing,
      federalNetInterestCost, treasurySecurities, reducingDeficit, treasuryBulletin, usaSpending];

    resources.forEach(resource => {
      resource.click();
      expect(spy).toHaveBeenCalledWith({
        category: 'Explainers',
        action: `Citation Click`,
        label: 'Debt - Dive Deeper into the Debt'
      });
      spy.mockClear();
    })
  });
})

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

  it('calls the appropriate analytics event when links are clicked on',  () => {
    const spy = jest.spyOn(Analytics, 'event');
    const { getByText, getByRole } = render(
      <DataSourcesMethodologies>{nationalDebtDataSources}</DataSourcesMethodologies>
    );

    const toggle = getByRole('button');
    act(() => {
      toggle.click();
    });

    const debtToThePenny = getByText('Debt to the Penny');
    const mspd = getByText('MSPD', {exact:false});
    const debtCeiling = getByText('Historical Debt Outstanding');
    const averageInterestRates = getByText('Average Interest Rates on U.S. Treasury Securities');
    const bls = getByText('Bureau of Labor Statistics');
    const bea = getByText('Bureau of Economic Analysis');
    const github = getByText('GitHub repository');

    const resources = [ debtToThePenny, mspd, debtCeiling, averageInterestRates, bls, bea];

    resources.forEach(resource => {
      resource.click();
      expect(spy).toHaveBeenCalledWith({
        category: 'Explainers',
        action: `Citation Click`,
        label: 'Debt - DS&M'
      });
      spy.mockClear();
    });

    github.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: 'Debt - DS&M Github'
    });
    spy.mockClear();
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

