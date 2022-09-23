import SourcesOfFederalRevenue from "./sources-of-federal-revenue"
import {render, waitFor} from "@testing-library/react"
import React from "react"
import fetchMock from "fetch-mock";
import {
  circleChartMockChartData,
  mockData,
  mockDataSupplementary,
  mockDataSocSec,
} from "./sources-of-federal-revenue-test-helper"

describe("Sources of Federal Revenue", () => {

  beforeAll(() => {
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:eq:1.1&sort=-record_date&page%5bsize%5d=1`,
      mockData, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1`,
      mockDataSupplementary, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=line_code_nbr:in:(50,60,70)&sort=-record_date&page[size]=3`,
      mockDataSocSec, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=10`,
      circleChartMockChartData, {overwriteRoutes: true}, {repeat: 1}
    );
    fetchMock.get(`https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:in:(1.1,1.2)&sort=-record_date&page[size]=2`,
      circleChartMockChartData, {overwriteRoutes: true}, {repeat: 1}
    );
  });


  it("renders the category sub header", () => {
    const { getByRole } = render(<SourcesOfFederalRevenue />)
    expect(
      getByRole("heading", { name: "Social Security and Medicare Taxes" })
    ).toBeInTheDocument()
  })

  it("render the quote box", () => {
    const { getByTestId, getByRole } = render(<SourcesOfFederalRevenue />)
    expect(getByRole("link", { name: "IRS.gov" })).toBeInTheDocument()
    expect(getByTestId("quote-box")).toBeInTheDocument()
  })

  it("renders the data in the section", async() => {
    const fetchSpy = jest.spyOn(global, 'fetch');
    const { getByText } = render(<SourcesOfFederalRevenue />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("So far in FY 2022", {exact:false})).toBeInTheDocument();
    expect(await getByText("54.5%", {exact:false})).toBeInTheDocument();
    expect(await getByText("30.8%", {exact:false})).toBeInTheDocument();
  })

})
