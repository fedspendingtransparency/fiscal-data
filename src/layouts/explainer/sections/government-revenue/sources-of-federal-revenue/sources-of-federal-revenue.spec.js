import SourcesOfFederalRevenue from "./sources-of-federal-revenue";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import fetchMock from "fetch-mock";

describe("Sources of Federal Revenue", () => {
  const mockData = {
    data: [
      {
        current_fytd_rcpt_outly_amt: "2404419075372.07",
        record_calendar_month: "06",
        record_calendar_year: "2022",
        record_date: "2022-06-30",
        record_fiscal_year: "2022",
      },
    ],
  };

  const mockDataSupplementary = {
    data: [
      {
        current_fytd_rcpt_outly_amt: "4408451733324.00",
        record_calendar_month: "06",
        record_calendar_year: "2022",
        record_date: "2022-06-30",
        record_fiscal_year: "2022",
      },
    ],
  };

  const mockDataSocSec = {
    data: [
      {
        current_fytd_rcpt_outly_amt: "1284877566101.73",
        record_calendar_month: "06",
        record_calendar_year: "2022",
        record_date: "2022-06-30",
        record_fiscal_year: "2022",
      },
      {
        current_fytd_rcpt_outly_amt: "66097914778.76",
        record_calendar_month: "06",
        record_calendar_year: "2022",
        record_date: "2022-06-30",
        record_fiscal_year: "2022",
      },
      {
        current_fytd_rcpt_outly_amt: "5667980667.19",
        record_calendar_month: "06",
        record_calendar_year: "2022",
        record_date: "2022-06-30",
        record_fiscal_year: "2022",
      },
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:eq:1.1&sort=-record_date&page%5bsize%5d=1`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1`,
      mockDataSupplementary,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=line_code_nbr:in:(50,60,70)&sort=-record_date&page[size]=3`,
      mockDataSocSec,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,sequence_number_cd:in:(1.1,1.2)&sort=-record_date&page[size]=2`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=line_code_nbr:eq:120&sort=-record_date&page[size]=1`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG&sort=-record_date,-current_fytd_rcpt_outly_amt&page[size]=10`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
  });

  it("renders the category sub header", () => {
    const { getByRole } = render(<SourcesOfFederalRevenue />);
    expect(
      getByRole("heading", { name: "Social Security and Medicare Taxes" })
    ).toBeInTheDocument();
  });

  it("render the quote box", () => {
    const { getByTestId, getByRole } = render(<SourcesOfFederalRevenue />);
    expect(getByRole("link", { name: "IRS.gov" })).toBeInTheDocument();
    expect(getByTestId("quote-box")).toBeInTheDocument();
  });

  it("renders the data in the section", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(<SourcesOfFederalRevenue />);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("56", { exact: false })).toBeInTheDocument();
    expect(await getByText("100", { exact: false })).toBeInTheDocument();
  });

  it('renders the accordion', () => {
    const {getByText} = render(
      <SourcesOfFederalRevenue />);
    expect(getByText('Why does the Federal Reserve send money to the federal government?'))
      .toBeInTheDocument();
  });
});
