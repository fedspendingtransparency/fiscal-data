import React from 'react';
import { render, RenderResult, waitFor, act } from '@testing-library/react';
import AmericasFinanceGuide from './index';
import { mockEndpointResponseMap, mockEndpointResponseMapAltDates } from '../../layouts/explainer/explainer-helpers/afg-overview-helpers';
import { setGlobalFetchMatchingResponse } from '../../utils/mock-utils';

import { useStaticQuery } from 'gatsby';

Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1200});

describe('Americas Finance Guide', () => {
  const glossaryMock =
    {
      "allGlossaryCsv": {
        "glossaryCsv": [
          {
            "term": "Excise",
            "definition": "A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).",
            "site_page": "Revenue Explainer & AFG Overview Page",
            "id": "12",
            "url_display": "",
            "url_path": ""
          }
        ]
      },
      "extensions": {}
    };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    // mock all data endpoints for inline evergreen values
    setGlobalFetchMatchingResponse(jest, mockEndpointResponseMap);
  })

  afterEach(() => {
    jest.resetModules();
  });
  it('renders the top container', async () => {
    let component: RenderResult;
    await act( async () => {
      component = render(<AmericasFinanceGuide />);
    });
    expect(component.getByTestId("topContainer")).toBeInTheDocument();
    expect(component.getByTestId("quoteContainer")).toBeInTheDocument();
    expect(component.getByTestId("bottomContainer")).toBeInTheDocument();
  });

  it('renders an component',  async () => {
    let component: RenderResult;
    await act( async () => {
      component = render(<AmericasFinanceGuide />);
    });
    const { container } = component;
    expect(container.querySelector('[data-testid="afg-icon"]')).toBeInTheDocument();
  });

  it('correctly populates values from API data / alt september language', async () => {

    let component: RenderResult;
    await act( async () => {
      component = render(<AmericasFinanceGuide />);
    });
    const { getByText, getAllByText } = component;
    await waitFor(() => {
      getByText("the federal government has collected $4.41 trillion", { exact: false });
      getByText("$5.35 trillion", { exact: false });
      getByText("by which spending exceeded revenue, $946 billion in", { exact: false });
      getByText("contributed", { exact: false });
      getByText("of $30.93 trillion through", { exact: false });
      getByText("September 2022", { exact: false });
      getByText("How did these totals compare to", { exact: false });
      getByText("$4.05 trillion", { exact: false });
      getByText("$6.82 trillion", { exact: false });
      getByText("the federal government spent the most on Income Security.", { exact: false });
      getByText("government spent $2.77 trillion more than it collected", { exact: false });
      getByText("the national deficit decreased by $360 billion compared", { exact: false });
      getByText("the government had $28.43 trillion in federal", { exact: false });
      expect(getAllByText('2022', { exact: false }).length).toBeGreaterThan(4);
      expect(getAllByText('2021', { exact: false }).length).toBeGreaterThan(8);
      expect(getAllByText('2020', { exact: false }).length).toBeGreaterThan(1);
    });

  });
});

describe('Americas Finance Guide regular language', () => {
  const glossaryMock =
    {
      "allGlossaryCsv": {
        "glossaryCsv": [
          {
            "term": "Excise",
            "definition": "A tax collected on certain goods and commodities produced or sold within the country (i.e. alcohol and tobacco, gasoline) and on licenses granted for certain activities (i.e. import/export license).",
            "site_page": "Revenue Explainer & AFG Overview Page",
            "id": "12",
            "url_display": "",
            "url_path": ""
          }
        ]
      },
      "extensions": {}
    };

  beforeAll(() => {
    useStaticQuery.mockReturnValue(glossaryMock);
  });
  beforeEach(() => {
    // mock all data endpoints for inline evergreen values
    setGlobalFetchMatchingResponse(jest, mockEndpointResponseMapAltDates);
  })

  afterEach(() => {
    jest.resetModules();
  });

  it('correctly uses language when not in september', async () => {

    let component: RenderResult;
    await act( async () => {
      component = render(<AmericasFinanceGuide />);
    });
    const { getByText } = component;
    await waitFor(() => {
      getByText("The federal government has collected", { exact: false });
      getByText("how has federal revenue and spending affected", { exact: false });
      getByText("the amount by which spending exceeds", { exact: false });
      getByText("the deficit this year has contributed", { exact: false });
    });

  });

});
