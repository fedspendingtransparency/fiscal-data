import {render, waitFor} from '@testing-library/react';
import React from "react";
import fetchMock from "fetch-mock";
import FederalRevenueOverview from "./federal-revenue-overview";


describe('Spending Key Takeaways evergreen values', () => {
  const mockDataDeficit = {
    "data": [{
      "current_fytd_net_outly_amt": "-22379494649.00",
      "record_calendar_month": "06",
      "record_calendar_year": "2021",
      "record_date": "2021-06-30",
      "record_fiscal_year": "2021"
    }]
  }

  const mockDataRevenue = {
    "data": [{
      "current_fytd_net_rcpt_amt": "2000000000.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2021",
      "record_date": "2021-06-30",
      "record_fiscal_year": "2021"
    }]
  }

  const mockDataSpending = {
    "data": [{
      "current_fytd_net_outly_amt": "42379494649.20",
      "record_calendar_month": "06",
      "record_calendar_year": "2021",
      "record_date": "2021-06-30",
      "record_fiscal_year": "2021"
    }]
  }

  // Tests were non functional when matcher had line break. Is matcher syntax off?

  beforeAll(() => {
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockDataRevenue, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5694,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockDataDeficit, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=-record_date&page%5bsize%5d=1`,
      mockDataSpending, {overwriteRoutes: true}, {repeat: 1}
    );
  });

  it('renders the data correctly in the overview section', async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const {getByText, getAllByText} = render(<FederalRevenueOverview />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("in FY 2021", {exact:false})).toBeInTheDocument();
    expect(await getAllByText("2 billion", {exact:false})[0]).toBeInTheDocument();
    expect(await getByText("spent more", {exact:false})).toBeInTheDocument();
    expect(await getAllByText("deficit", {exact:false})[0]).toBeInTheDocument();
    expect(await getByText("22 billion", {exact:false})).toBeInTheDocument();
  });

});
