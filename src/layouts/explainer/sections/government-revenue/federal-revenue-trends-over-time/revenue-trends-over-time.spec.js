import React from "react";
import { render, waitFor } from "@testing-library/react";
import FederalRevenueTrendsOverTime from "./federal-revenue-trends-over-time";
import fetchMock from "fetch-mock";

describe("revenue trends over time section", () => {

  const mockCpiDataset = {
    "2011": "10",
    "2012": "5",
    "2013": "5",
    "2020": "15",
    "2021": "15",
  };

  const mockData = {
    data: [
      {
        current_fytd_net_rcpt_amt: "22379494649.20",
        record_calendar_month: "06",
        record_calendar_year: "2015",
        record_date: "2015-06-30",
        record_fiscal_year: "2015",
      },
    ],
  };

  const mockLastData = {
    data: [
      {
        current_fytd_net_rcpt_amt: "42379494649.20",
        record_calendar_month: "06",
        record_calendar_year: "2021",
        record_date: "2021-06-30",
        record_fiscal_year: "2021",
      },
    ],
  };

  const mockDataChart = {
    "data":[{
      "record_date":"2021-08-31",
      "classification_desc":"Cat 1",
      "current_month_rcpt_outly_amt":"140935655362.90",
      "current_fytd_rcpt_outly_amt":"2404419075372.07",
      "prior_fytd_rcpt_outly_amt":"1829589214940.55",
      "table_nbr":"9",
      "src_line_nbr":"2",
      "print_order_nbr":"2",
      "line_code_nbr":"20",
      "data_type_cd":"D",
      "record_type_cd":"RSG",
      "sequence_level_nbr":"2",
      "sequence_number_cd":"1.1",
      "record_fiscal_year":"2021",
      "record_fiscal_quarter":"4",
      "record_calendar_year":"2021",
      "record_calendar_quarter":"3",
      "record_calendar_month":"08",
      "record_calendar_day":"31"
    },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 2",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"30",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 3",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"50",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 4",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"60",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 5",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"70",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 6",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"80",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 7",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"90",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 8",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"100",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      },
      {
        "record_date":"2021-08-31",
        "classification_desc":"Cat 9",
        "current_month_rcpt_outly_amt":"140935655362.90",
        "current_fytd_rcpt_outly_amt":"2404419075372.07",
        "prior_fytd_rcpt_outly_amt":"1829589214940.55",
        "table_nbr":"9",
        "src_line_nbr":"2",
        "print_order_nbr":"2",
        "line_code_nbr":"110",
        "data_type_cd":"D",
        "record_type_cd":"RSG",
        "sequence_level_nbr":"2",
        "sequence_number_cd":"1.1",
        "record_fiscal_year":"2021",
        "record_fiscal_quarter":"4",
        "record_calendar_year":"2021",
        "record_calendar_quarter":"3",
        "record_calendar_month":"08",
        "record_calendar_day":"31"
      }]
  }

  beforeAll(() => {
    const highestTotalEndpoint = `v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date`;

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_type_cd:eq:RSG,record_calendar_month:eq:09&sort=-record_date`,
      mockDataChart,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_4?filter=line_code_nbr:eq:830,record_calendar_month:eq:09&sort=-record_date&page[size]=1`,
      mockLastData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );

    fetchMock.get(
      `https://www.transparency.treasury.gov/services/api/fiscal_service/${highestTotalEndpoint}`,
      mockLastData,
      { overwriteRoutes: true },
      { repeat: 1 }
    );
  });

  it("renders the revenue trends line chart", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByTestId("revenueTrendsLineChart")).toBeInTheDocument();
  });

  it("renders data for section", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <FederalRevenueTrendsOverTime cpiDataByYear={mockCpiDataset} />
    );
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(await getByText("since 2015", { exact: false })).toBeInTheDocument();
    expect(
      await getByText("- 2021 dollars", { exact: false })
    ).toBeInTheDocument();
  });
});
