import FederalRevenueTrendsAndUSEconomy from
    "./federal-revenue-trends-and-us-economy";
import { render } from "@testing-library/react";
import React from "react";
import {mockBeaGDPData, mockCpiDataset, mockRevenueData} from "../../../explainer-test-helper"
import fetchMock from "fetch-mock";
import {determineBEAFetchResponse} from "../../../../../utils/mock-utils";


jest.mock('../../../../../hooks/useBeaGDP', () => {
  return () => mockBeaGDPData;
});

describe("Sources of Federal Revenue", () => {
  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockRevenueData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockRevenueData);
  });


  it("render the quote box", () => {
    const { getByTestId, getByRole } = render(
      <FederalRevenueTrendsAndUSEconomy cpiDataByYear={mockCpiDataset} />);
    expect(getByRole("link", { name: "GPS.gov" })).toBeInTheDocument();
    expect(getByTestId("quote-box")).toBeInTheDocument();
  });
});
