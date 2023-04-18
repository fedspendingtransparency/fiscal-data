import React from 'react';
import {
  render,
  act,
} from '@testing-library/react';
import nationalDebtSections, {
  DebtCeilingSection,
  debtCeilingSectionAccordionTitle,
  nationalDebtDataSources,
  nationalDebtDescriptionGenerator,
  nationalDebtDescriptionAppendix,
  FundingProgramsSection,
  DebtTrackingSection
} from "./national-debt";
import {
  mockExplainerPageResponse,
  mockBeaGDPData
} from "../../explainer-test-helper"
import {
  setGlobalFetchResponse,
} from "../../../../utils/mock-utils"
import DataSourcesMethodologies from "../../data-sources-methodologies/data-sources-methodologies"
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

