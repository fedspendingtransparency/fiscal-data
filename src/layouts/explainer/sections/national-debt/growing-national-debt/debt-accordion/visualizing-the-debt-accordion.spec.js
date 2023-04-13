import fetchMock from "fetch-mock";
import {render, waitForElementToBeRemoved} from "@testing-library/react";
import {VisualizingTheDebtAccordion} from "./visualizing-the-debt-accordion";
import React from "react";
import {mockBeaGDPData} from "../../../../explainer-test-helper";


jest.mock('../../../../../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
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
