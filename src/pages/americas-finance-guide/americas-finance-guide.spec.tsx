import React from 'react'
import { render, RenderResult, waitFor, act } from "@testing-library/react"
import AmericasFinanceGuidePage from "./index"
import { mockEndpointResponseMap } from "./afg-overview-helpers"
import { setGlobalFetchMatchingResponse } from "../../utils/mock-utils"

describe('Americas Finance Guide', () => {
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
        component = render(<AmericasFinanceGuidePage />);
      });
      expect(component.getByTestId("topContainer")).toBeInTheDocument();
      expect(component.getByTestId("quoteContainer")).toBeInTheDocument();
      expect(component.getByTestId("bottomContainer")).toBeInTheDocument();
    });

    it('renders an component',  async () => {
      let component: RenderResult;
      await act( async () => {
        component = render(<AmericasFinanceGuidePage />);
      });
      const { getByTestId, container } = component;
      expect(container.querySelector('[data-testid="afg-icon"]')).toBeInTheDocument();
      //expect(getByTestId("afg-icon")).toBeInTheDocument()
    });

  it('correctly populates values from API data', async () => {

    let component: RenderResult;
    await act( async () => {
      component = render(<AmericasFinanceGuidePage />);
    });
    const { getByText, getAllByText } = component;
      await waitFor(() => {
        getByText("the federal government has collected $4.41 trillion", { exact: false });
        getByText("$5.35 trillion", { exact: false });
        getByText("by which spending exceeds revenue, $946 billion in", { exact: false });
        getByText("the federal government has $30.90 trillion", { exact: false });
        getByText("How did these totals compare to", { exact: false });
        getByText("$4.05 trillion", { exact: false });
        getByText("$6.82 trillion", { exact: false });
        getByText("the federal government spent the most on Income Security.", { exact: false });
        getByText("government spent $2.77 trillion more than it collected", { exact: false });
        getByText("the national deficit decreased by $360 billion compared", { exact: false });
        getByText("the government had $28.43 trillion, in federal", { exact: false });
        expect(getAllByText('2022', { exact: false }).length).toBeGreaterThan(4);
        expect(getAllByText('2021', { exact: false }).length).toBeGreaterThan(8);
        expect(getAllByText('2020', { exact: false }).length).toBeGreaterThan(1);
      });

  });
});
