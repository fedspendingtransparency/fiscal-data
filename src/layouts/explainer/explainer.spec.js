import React from 'react';
import { render } from '@testing-library/react';
import ExplainerPageLayout from './explainer';
import explainerSections from './sections/sections';
import { mockBeaGDPData, mockSpendingHeroData, mockUseStaticBeaGDP } from './explainer-test-helper';
import { determineBEAFetchResponse, setGlobalFetchMatchingResponse } from '../../utils/mock-utils';
import { understandingDeficitMatchers } from './explainer-helpers/national-deficit/national-deficit-test-helper';
import fetchMock from 'fetch-mock';
import { circleChartMockChartData, governmentRevenueMatchers } from './explainer-helpers/government-revenue/government-revenue-test-helper';
import { useStaticQuery } from 'gatsby';
import { RecoilRoot } from 'recoil';
jest.mock('../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
});

const afgPath = '/americas-finance-guide/test/';
const nonAfgPath = '/not-afg/test/';

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
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
  };

  it('renders the deficit explainer page', async () => {
    const pageName = 'national-deficit';
    const deficitPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout path={afgPath} pageContext={deficitPageContext} />
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
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    cpiDataByYear,
  };

  it('renders the spending explainer page', async () => {
    const pageName = 'federal-spending';
    const spendingPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout path={afgPath} pageContext={spendingPageContext} />
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
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    cpiDataByYear,
  };

  it('renders the revenue explainer page', async () => {
    const pageName = 'government-revenue';
    const spendingPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, findByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout path={afgPath} pageContext={spendingPageContext} />
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

  const mockPageContext = {
    pageName,
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
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
        <ExplainerPageLayout path={afgPath} pageContext={mockPageContext} />
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
  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
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
  const glossary = [];
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary,
    cpiDataByYear,
  };

  it('renders the savings bonds explainer page', async () => {
    const pageName = 'treasury-savings-bonds';
    const spendingPageContext = {
      pageName,
      ...mockPageContext,
    };

    const { findAllByTestId, findByText, queryByTestId } = render(
      <RecoilRoot>
        <ExplainerPageLayout path={nonAfgPath} pageContext={spendingPageContext} />
      </RecoilRoot>
    );

    const sectionHeadings = await findAllByTestId('section-heading');
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();

    const subNav = queryByTestId('explainerSubNav');
    expect(subNav).not.toBeInTheDocument();
  });
});
