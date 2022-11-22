import { render, waitFor } from "@testing-library/react";
import React from "react";
import TotalSpendingChart from "./total-spending-chart";
import fetchMock from "fetch-mock";
import { determineBEAFetchResponse } from "../../../../../../utils/mock-utils";

describe("Total Spending Chart", () => {
  const mockCpiDataset = {
    "2015": "237.945",
    "2016": "241.428",
    "2017": "246.819",
    "2018": "252.439",
    "2019": "256.759",
    "2020": "260.280",
    "2021": "274.310",
    "2022": "296.808",
  };

  const mockPageFunction = () => {
    return null;
  }

  const mockCallOutData = {
    data: [
      {
        current_fytd_net_outly_amt: "3687622059038.44",
        record_date: "2015-09-30",
        record_fiscal_year: "2015",
      },
    ],
  };

  const mockSpendingData = {
    data: [
      {
        current_fytd_net_outly_amt: "3687622059038.44",
        record_date: "2015-09-30",
        record_fiscal_year: "2015",
      },
      {
        current_fytd_net_outly_amt: "3854100140609.65",
        record_date: "2016-09-30",
        record_fiscal_year: "2016",
      },
      {
        current_fytd_net_outly_amt: "3980605417586.44",
        record_date: "2017-09-30",
        record_fiscal_year: "2017",
      },
      {
        current_fytd_net_outly_amt: "4107741496584.31",
        record_date: "2018-09-30",
        record_fiscal_year: "2018",
      },
      {
        current_fytd_net_outly_amt: "4446583636480.58",
        record_date: "2019-09-30",
        record_fiscal_year: "2019",
      },
      {
        current_fytd_net_outly_amt: "6551872254653.64",
        record_date: "2020-09-30",
        record_fiscal_year: "2020",
      },
      {
        current_fytd_net_outly_amt: "6818157647016.83",
        record_date: "2021-09-30",
        record_fiscal_year: "2021",
      },
      {
        current_fytd_net_outly_amt: "6271507596876.00",
        record_date: "2022-09-30",
        record_fiscal_year: "2022"
      }
    ],
  };

  beforeAll(() => {
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_date&page[size]=1`,
      mockCallOutData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    fetchMock.get(
      `begin:v1/accounting/mts/mts_table_5?fields=current_fytd_net_outly_amt,record_date,record_fiscal_year&filter=line_code_nbr:eq:5691,record_calendar_month:eq:09&sort=record_datet`,
      mockSpendingData,
      { overwriteRoutes: true },
      { repeat: 0 }
    );
    determineBEAFetchResponse(jest, mockSpendingData);
  });

  it("renders the calloutText", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    //If this is set, that means all 3 API calls were sucessful.
    expect(await getByText("Since 2015, the Spending to GDP ratio has increased from 20% to 30%.", { exact: false })).toBeInTheDocument();
  });

  it("renders the chart", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("chartParent")).toBeInTheDocument();
  });

  it("renders the chart markers and data header labels", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getAllByText, getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getAllByText("Total Spending")).toHaveLength(3);
    expect(await getAllByText("GDP")).toHaveLength(2);
    expect(await getByText("Fiscal Year")).toBeInTheDocument();
  });

  it("renders the CustomPoints layer", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("customPoints")).toBeInTheDocument();
    expect(await getByTestId("customPoints").querySelector('circle').length === 4 );
  });

  it("renders the CustomSlices layer", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByTestId("customSlices")).toBeInTheDocument();
    expect(await getByTestId("customSlices")?.querySelector('rect')?.length === 8 );
  });

  it("renders the chart headers", async () => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByText } = render(
      <TotalSpendingChart cpiDataByYear={mockCpiDataset} copyPageData={mockPageFunction} />
    );
    await waitFor(() => expect(fetchSpy).toBeCalled());
    expect(await getByText("Government Spending and the U.S. Economy (GDP), FY 2015 – 2021", { exact: false })).toBeInTheDocument();
    expect(await getByText("Inflation Adjusted - 2021 Dollars", { exact: false })).toBeInTheDocument();
  });
});
