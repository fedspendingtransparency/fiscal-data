import React from 'react';
import { render } from '@testing-library/react';
import ExplainerPageLayout from './explainer';
import explainerSections from './sections/sections';
import mockExplainerPageResponse, {mockCPIResponse} from './explainer-test-helper';
import { setGlobalFetchResponse } from '../../utils/mock-utils';
import {inflateAmountToCurrentDollars} from "./explainer-helpers/explainer-helpers";



describe('Explainer Helpers', () => {
  beforeEach(() => {
    setGlobalFetchResponse( jest, mockCPIResponse);
  });

  it('inflation adjustment helper', async () => {
    const dollar_amount = 5;
    const date = 1;
    inflateAmountToCurrentDollars(dollar_amount, date);
    expect(true);
  })

});

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

  const mockPageContext = {
    pageName,
    breadCrumbLinkName,
    seoConfig,
    heroImage
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
