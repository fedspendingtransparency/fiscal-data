import React from "react";
import {
  fireEvent,
  render,
  waitFor
} from "@testing-library/react";
import fetchMock from 'fetch-mock';
import NationalDebtHero from "./national-debt-hero";
import Analytics from "../../../../utils/analytics/analytics";
import SiteHeader from "../../../../components/site-header/site-header";

jest.mock('../../../../components/split-flap-display/split-flap-display',
  () => {
    return ({value, valueType, minLength}) =>
      <>
        <div>Value:{value}</div>
        <div>valueType:{valueType}</div>
        <div>minLength:{minLength}</div>
      </>
});

describe('National Debt Hero', () => {

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

    const {getByText} = render(<NationalDebtHero />);
    expect(fetchSpy).toBeCalled();
    await waitFor(() => getByText("28908004857445", {exact:false}));
    expect(await getByText("28908004857445", {exact: false})).toBeInTheDocument();
    global.fetch.mockRestore();
  });

  it('calls the appropriate analytics event when link is clicked on', async () => {
    const spy = jest.spyOn(Analytics, 'event');
    const {getByText} = render(<NationalDebtHero />);
    await waitFor(() => getByText("28908004857445", {exact:false}));

    const debtToThePenny = getByText('Debt to the Penny');

    debtToThePenny.click();
    expect(spy).toHaveBeenCalledWith({
      category: 'Explainers',
      action: `Citation Click`,
      label: `Debt - What is the national debt?`
    });
    spy.mockClear();
  });

});
