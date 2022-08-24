import React from 'react';
import { render } from '@testing-library/react';
import ExplainerPageLayout from './explainer';
import explainerSections from './sections/sections';
import {
  mockExplainerPageResponse, mockSpendingHeroData,
} from './explainer-test-helper';
import {setGlobalFetchMatchingResponse, setGlobalFetchResponse} from '../../utils/mock-utils';
import {understandingDeficitMatchers} from
    "./explainer-helpers/national-deficit/national-deficit-test-helper";
import fetchMock from "fetch-mock";

describe('Explainer Page Layout', () => {
  const pageName = 'national-debt';
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description'
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading'
  }
  const glossary = [];

  const mockPageContext = {
    pageName,
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary
  }

  beforeEach(() => {
    setGlobalFetchResponse(
      jest, [
        {
          matcher: (url) => url.match(/v2\/accounting\/od\/debt_to_penny/g),
          jsonResponse: {
            "data": [{
              "tot_pub_debt_out_amt": "28908004857445.12",
              "record_date": "2021-12-13"
            }]
          }
        },
        { matcher: (url) => true, jsonResponse: mockExplainerPageResponse }
      ]);
  });

  it('renders the explainer page', async () => {
    const { findAllByTestId, findByText } = render(
      <ExplainerPageLayout
        pageContext={mockPageContext}
      />
    );

    const sectionHeadings = await findAllByTestId('section-heading')
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();
  })


});

describe('Deficit explainer', () => {
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
    description: 'mock description'
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading'
  }
  const glossary = [];
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary
  }

  it('renders the deficit explainer page', async () => {
    const pageName = 'national-deficit';
    const deficitPageContext = {
      pageName,
      ...mockPageContext
    }

    const { findAllByTestId, findByText } = render(
      <ExplainerPageLayout
        pageContext={deficitPageContext}
      />
    );

    const sectionHeadings = await findAllByTestId('section-heading')
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();
  })
})

describe('Spending explainer', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    fetchMock.get(`begin:https://www.transparency.treasury.gov/services/api/fiscal_service/`,
      mockSpendingHeroData, {overwriteRoutes: true}, {repeat: 1}
    )
  });

  afterEach(() => {
    jest.resetModules();
    // global.fetch.mockReset();
  });
  const breadCrumbLinkName = 'mock link';
  const seoConfig = {
    pageTitle: 'mock title',
    description: 'mock description'
  };
  const heroImage = {
    heading: 'mock heading',
    subHeading: 'mock subheading'
  }
  const glossary = [];
  const mockPageContext = {
    breadCrumbLinkName,
    seoConfig,
    heroImage,
    glossary
  }

  it('renders the spending explainer page', async () => {
    const pageName = 'federal-spending';
    const spendingPageContext = {
      pageName,
      ...mockPageContext
    }

    const { findAllByTestId, findByText } = render(
      <ExplainerPageLayout
        pageContext={spendingPageContext}
      />
    );

    const sectionHeadings = await findAllByTestId('section-heading')
    expect(sectionHeadings.length).toEqual(explainerSections[pageName].length);

    const dataSourcesMethodologies = await findByText('Data Sources & Methodologies');
    expect(dataSourcesMethodologies).toBeInTheDocument();
    global.fetch.mockReset();
  })
})
