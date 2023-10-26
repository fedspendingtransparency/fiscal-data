import React from 'react';
import { render, RenderResult, waitFor, act } from '@testing-library/react';
import AmericasFinanceGuide from './index';
import { mockEndpointResponseMap, mockEndpointResponseMapAltDates } from '../../layouts/explainer/explainer-helpers/afg-overview-helpers';
import { setGlobalFetchMatchingResponse } from '../../utils/mock-utils';

import { useStaticQuery } from 'gatsby';

Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1200 });

describe('Americas Finance Guide', () => {
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

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    // mock all data endpoints for inline evergreen values
    setGlobalFetchMatchingResponse(jest, mockEndpointResponseMap);
  });

  afterEach(() => {
    jest.resetModules();
  });
  it('renders the top container', async () => {
    let component: RenderResult;
    await act(async () => {
      component = render(<AmericasFinanceGuide />);
    });
    expect(component.getByTestId('topContainer')).toBeInTheDocument();
    expect(component.getByTestId('quoteContainer')).toBeInTheDocument();
    expect(component.getByTestId('bottomContainer')).toBeInTheDocument();
  });

  it('renders an component', async () => {
    let component: RenderResult;
    await act(async () => {
      component = render(<AmericasFinanceGuide />);
    });
    const { container } = component;
    expect(container.querySelector('[data-testid="afg-icon"]')).toBeInTheDocument();
  });
});

describe('Americas Finance Guide regular language', () => {
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

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    // mock all data endpoints for inline evergreen values
    setGlobalFetchMatchingResponse(jest, mockEndpointResponseMapAltDates);
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('correctly uses language when not in september', async () => {
    let component: RenderResult;
    await act(async () => {
      component = render(<AmericasFinanceGuide />);
    });
    const { getByText } = component;
    await waitFor(() => {
      getByText('The federal government has collected', { exact: false });
      getByText('how has federal revenue and spending affected', { exact: false });
      getByText('the amount by which spending exceeds', { exact: false });
      getByText('the deficit this year has contributed', { exact: false });
    });
  });
});
