import React from 'react';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import ExplainerPageLayout from './explainer';
import explainerSections from './sections/sections';
import { mockBeaGDPData, mockSavingsBondFetchResponses, mockSpendingHeroData } from './explainer-test-helper';
import { determineBEAFetchResponse, setGlobalFetchMatchingResponse } from '../../utils/mock-utils';
import { understandingDeficitMatchers } from './explainer-helpers/national-deficit/national-deficit-test-helper';
import fetchMock from 'fetch-mock';
import { circleChartMockChartData, governmentRevenueMatchers } from './explainer-helpers/government-revenue/government-revenue-test-helper';
import { useStaticQuery } from 'gatsby';
import { RecoilRoot } from 'recoil';
import * as Gatsby from 'gatsby';
import Analytics from '../../utils/analytics/analytics';
import {
  analyticsEventHandler,
  datasetSectionConfig,
  explainerCitationsMap,
  explainerHeroMap,
} from './explainer-helpers/explainer-helpers';

jest.mock('../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
});

const glossaryMock = {
  allGlossaryCsv: {
    glossaryCsv: [
      {
        term: 'Excise',
        definition:
          'A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).',
        site_page: 'Revenue Explainer & AFG Overview Page',
        id: '12',
        url_display: '',
        url_path: '',
      },
    ],
  },
  extensions: {},
};

describe('Deficit explainer', () => {
  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, understandingDeficitMatchers);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading',
  };
  const glossary = [];
  const isAFG = true;

  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    isAFG,
  };

  it('renders the deficit explainer page', async () => {
    const pageName = 'national-deficit';
    const deficitPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout pageContext={deficitPageContext} />
      </RecoilRoot>
    );

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = await findByTestId('explainerSubNav');
    expect(subNav).toBeInTheDocument();
  });
});

describe('Spending explainer', () => {
  const mockData = {
    data: [
      {
        current_fytd_net_outly_amt: '4515067070149.23',
        prior_fytd_net_outly_amt: '2237949464925.20',
        record_calendar_month: '06',
        record_calendar_year: '2021',
        record_date: '2021-06-30',
        record_fiscal_year: '2021',
      },
    ],
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service
    /v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `begin:https://www.transparency.treasury.gov/services/api/fiscal_service/
    v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,prior_fytd_net_outly_amt`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    determineBEAFetchResponse(jest, mockData);
  });

  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading',
  };
  const cpiDataByYear = {
    '2015': '237.945',
    '2016': '241.428',
    '2017': '246.819',
    '2018': '252.439',
    '2019': '256.759',
    '2020': '260.280',
    '2021': '274.310',
    '2022': '296.808',
  };
  const glossary = [];
  const isAFG = true;

  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    cpiDataByYear,
    isAFG,
  };

  it('renders the spending explainer page', async () => {
    const pageName = 'federal-spending';
    const spendingPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout pageContext={spendingPageContext} />
      </RecoilRoot>
    );

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = await findByTestId('explainerSubNav');
    expect(subNav).toBeInTheDocument();
  });
});

describe('Revenue explainer', () => {
  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    setGlobalFetchMatchingResponse(jest, governmentRevenueMatchers);
    determineBEAFetchResponse(jest, circleChartMockChartData);
  });
  afterEach(() => {
    jest.resetModules();
    global.fetch.mockReset();
  });

  const cpiDataByYear = {
    '2011': '10',
    '2012': '5',
    '2013': '5',
    '2020': '15',
    '2021': '15',
  };
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading',
  };
  const glossary = [];
  const isAFG = true;
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    cpiDataByYear,
    isAFG,
  };

  it('renders the revenue explainer page', async () => {
    const pageName = 'government-revenue';
    const spendingPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout pageContext={spendingPageContext} />
      </RecoilRoot>
    );

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = await findByTestId('explainerSubNav');
    expect(subNav).toBeInTheDocument();
  });
});

describe('Explainer Page Layout', () => {
  const pageName = 'national-debt';
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading',
  };
  const glossary = [];
  const isAFG = true;

  const mockPageContext = {
    pageName,
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    isAFG,
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });

  afterEach(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    setGlobalFetchMatchingResponse(jest, [
      {
        matcher: url => {
          return url.includes('debt_to_penny?fields=');
        },
        jsonResponse: {
          data: [
            {
              tot_pub_debt_out_amt: '28908004857445.12',
              record_date: '2021-12-13',
            },
          ],
        },
      },
    ]);
  });

  it('renders the debt explainer page', async () => {
    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout pageContext={mockPageContext} />
      </RecoilRoot>
    );

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = await findByTestId('explainerSubNav');
    expect(subNav).toBeInTheDocument();
  });
});

describe('Savings Bonds explainer', () => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;

  const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`);
  const mockUseStaticQuery = {
    allSavingsBondsByTypeHistoricalCsv: {
      savingsBondsByTypeHistoricalCsv: [{ year: 2023, bond_type: 'A', sales: 1 }],
    },
    allGlossaryCsv: {
      glossaryCsv: [
        {
          term: 'Excise',
          definition:
            'A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).',
          site_page: 'Revenue Explainer & AFG Overview Page',
          id: '12',
          url_display: '',
          url_path: '',
        },
      ],
    },
    extensions: {},
  };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(mockUseStaticQuery);
    mockSavingsBondFetchResponses();
  });

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetModules();
  });

  const cpiDataByYear = {
    '2011': '10',
    '2012': '5',
    '2013': '5',
    '2020': '15',
    '2021': '15',
  };
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description',
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading',
  };
  const isAFG = false;
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    cpiDataByYear,
    isAFG,
  };

  it('renders the savings bonds explainer page', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const pageName = 'treasury-savings-bonds';

    const savingsBondsPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, queryByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout pageContext={savingsBondsPageContext} />
      </RecoilRoot>
    );

    await waitFor(() => expect(fetchSpy).toBeCalled());

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = queryByTestId('explainerSubNav');
    expect(subNav).not.toBeInTheDocument();
  });
});

describe('analyticsEventHandler', ()=> {
  it('fires Analytics with correct data', () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event')

    analyticsEventHandler('Bureau of Labor Statistics', 'Debt Citation Click')

    expect(analyticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Bureau of Labor Statistics'
    });
  });
});

describe('explainerHeroMap', ()=> {
  it('renders a hero for every slug', () => {
    Object.entries(explainerHeroMap).forEach(([, { component }]) => {
      const el = component();
      expect(React.isValidElement(el)).toBe(true);
    });
  });
});


describe('explainer citations', ()=> {
  it('fires analytics when BLS citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const blsCitations = explainerCitationsMap['national-debt'].bls;
    render(<>{blsCitations}</>);

    fireEvent.click(screen.getByText('Bureau of Labor Statistics'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Bureau of Labor Statistics'
    })
  });

  it('fires analytics when BEA citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const beaCitations = explainerCitationsMap['national-debt'].bea;
    render(<>{beaCitations}</>);

    fireEvent.click(screen.getByText('Bureau of Economic Analysis'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Bureau of Economic Analysis'
    });
  });

  it('fires analytics when BEA survey citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const beaSurveyCitations = explainerCitationsMap['national-debt'].beaSurvey;
    render(<>{beaSurveyCitations}</>);

    fireEvent.click(screen.getByText('Bureau of Economic Analysis'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Bureau of Economic Analysis'
    });
  });

  it('fires analytics when MTS summary citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mtsSummaryCitations = explainerCitationsMap['national-debt'].mtsSummary;
    render(<>{mtsSummaryCitations}</>);

    fireEvent.click(screen.getByText('Monthly Treasury Statement (MTS)'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Monthly Treasury Statement (MTS)'
    });
  });

  it('fires analytics when MTS outlays citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mtsOutlaysCitations = explainerCitationsMap['national-debt'].mtsOutlays;
    render(<>{mtsOutlaysCitations}</>);

    fireEvent.click(screen.getByText('Monthly Treasury Statement (MTS)'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Monthly Treasury Statement (MTS)'
    })

  });

  it('fires analytics when MTS receipts citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mtsReceiptsCitations = explainerCitationsMap['national-debt'].mtsReceipts;
    render(<>{mtsReceiptsCitations}</>);

    fireEvent.click(screen.getByText('Monthly Treasury Statement (MTS)'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Monthly Treasury Statement (MTS)'
    });
  });

  it('fires analytics when MTS summary receipts citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mtsSummaryReceiptsCitations = explainerCitationsMap['national-debt'].mtsSummaryReceipts;
    render(<>{mtsSummaryReceiptsCitations}</>);

    fireEvent.click(screen.getByText('Monthly Treasury Statement (MTS)'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Monthly Treasury Statement (MTS)'
    });
  });


  it('fires analytics when MSPD citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mspdCitations = explainerCitationsMap['national-debt'].mspd;
    render(<>{mspdCitations}</>);

    fireEvent.click(screen.getByText('Monthly Statement of the Public Debt (MSPD)'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Monthly Statement of the Public Debt (MSPD)'
    });
  });

  it('fires analytics when debtToThePenny citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const debtToThePennyCitations = explainerCitationsMap['national-debt'].debtToThePenny;
    render(<>{debtToThePennyCitations}</>);

    fireEvent.click(screen.getByText('Debt to the Penny'));

    expect(anlayticsSpy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: 'Debt Citation Click',
      label: 'Debt to the Penny'
    });
  });

  it('fires analytics when github citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const githubCitation = explainerCitationsMap['national-debt'].github;

    githubCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when mspdSummary citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mspdSummaryCitation = explainerCitationsMap['national-debt'].mspdSummary;

    mspdSummaryCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when mspdOutstanding citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const mspdOutstandingCitation = explainerCitationsMap['national-debt'].mspdOutstanding;

    mspdOutstandingCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when historicalDebt citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const historicalDebtCitation = explainerCitationsMap['national-debt'].historicalDebt;

    historicalDebtCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when treasuryDirectHistoricalDebt citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const treasuryDirectHistoricalDebtCitation = explainerCitationsMap['national-debt'].treasuryDirectHistoricalDebt;

    treasuryDirectHistoricalDebtCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAs citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsCitation = explainerCitationsMap['national-debt'].USAs;

    USAsCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsGov citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsGovCitation = explainerCitationsMap['national-debt'].USAsGov;

    USAsGovCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsExplorer citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsExplorerCitation = explainerCitationsMap['national-debt'].USAsExplorer;

    USAsExplorerCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsExplorerPage citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsExplorerPageCitation = explainerCitationsMap['national-debt'].USAsExplorerPage;

    USAsExplorerPageCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsAgencyPage citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsAgencyPageCitation = explainerCitationsMap['national-debt'].USAsAgencyPage;

    USAsAgencyPageCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsObjectClass citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsObjectClassCitation = explainerCitationsMap['national-debt'].USAsObjectClass;

    USAsObjectClassCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsBudgetFunction citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsBudgetFunctionCitation = explainerCitationsMap['national-debt'].USAsBudgetFunction;

    USAsBudgetFunctionCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsCovidSpending citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsCovidSpendingCitation = explainerCitationsMap['national-debt'].USAsCovidSpending;

    USAsCovidSpendingCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsCovidResponse citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsCovidResponseCitation = explainerCitationsMap['national-debt'].USAsCovidResponse;

    USAsCovidResponseCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when USAsCovidFederalResponse citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const USAsCovidFederalResponseCitation = explainerCitationsMap['national-debt'].USAsCovidFederalResponse;

    USAsCovidFederalResponseCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when fiscalService citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const fiscalServiceCitation = explainerCitationsMap['national-debt'].fiscalService;

    fiscalServiceCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when treasurySecurities citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const treasurySecuritiesCitation = explainerCitationsMap['national-debt'].treasurySecurities;

    treasurySecuritiesCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when ssaAnnualReports citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const ssaAnnualReportCitation = explainerCitationsMap['national-debt'].ssaAnnualReport;

    ssaAnnualReportCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when ssa citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const ssaCitation = explainerCitationsMap['national-debt'].ssa;

    ssaCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when monetaryPolicy citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const monetaryPolicyCitation = explainerCitationsMap['national-debt'].monetaryPolicy;

    monetaryPolicyCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when gps citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const gpsCitation = explainerCitationsMap['national-debt'].gps;

    gpsCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when irs citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const irsCitation = explainerCitationsMap['national-debt'].irs;

    irsCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('fires analytics when federalReserveAct citation is clicked', () => {
    const anlayticsSpy = jest.spyOn(Analytics, 'event')

    const federalReserveActCitation = explainerCitationsMap['national-debt'].federalReserveAct;

    federalReserveActCitation.props.onClick();
    expect(anlayticsSpy).toHaveBeenCalled();
  });

  it('transforms historical debt records', () => {
    const transformer = datasetSectionConfig['national-debt']['breaking-down-the-debt'].transformer;

    const response = {
     data: [
       {
         record_calendar_month: '09',
         record_calendar_year: '2013',
         debt_held_public_mil_amt: '15000000',
         intragov_hold_mil_amt: '5000000',
       },
       {
         record_calendar_month: '09',
         record_calendar_year: '2023',
         debt_held_public_mil_amt: '20000000',
         intragov_hold_mil_amt: '8000000',
       },
     ],
    };

    const result = transformer(response);
    expect(result).toHaveLength(2);
    const [prior, latest] = result

    expect(prior.total).toBe(20);
    expect(latest.total).toBe(28)
  });

});
