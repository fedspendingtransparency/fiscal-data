import { render } from "@testing-library/react";
import React from "react";
import TotalSpendingChart from "./total-spending-chart";

describe("Total Spending Chart", () => {
  it("renders the chart", () => {
    const { getByTestId } = render(<TotalSpendingChart />);
    expect(getByTestId("chartParent")).toBeInTheDocument();
  });

  it("renders the chart markers and data header labels", () => {
    const { getAllByText, getByText } = render(<TotalSpendingChart />);
    expect(getAllByText("Total Spending")).toHaveLength(3);
    expect(getAllByText("GDP")).toHaveLength(2);
    expect(getByText("Fiscal Year")).toBeInTheDocument();
  });
});
