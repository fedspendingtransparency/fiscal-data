import SourcesOfFederalRevenue from "./federal-revenue-trends-and-us-economy";
import { render } from "@testing-library/react";
import React from "react";

describe("Sources of Federal Revenue", () => {
  xit("render the quote box", () => {
    const { getByTestId, getByRole } = render(<SourcesOfFederalRevenue />);
    expect(getByRole("link", { name: "GPS.gov" })).toBeInTheDocument();
    expect(getByTestId("quote-box")).toBeInTheDocument();
  });
});
