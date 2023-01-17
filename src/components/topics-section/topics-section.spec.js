import React from "react";
import { render } from "@testing-library/react";
import { TopicsSection } from "./topics-section";

global.___loader = {
  enqueue: jest.fn(),
};

describe("Topics section", () => {
  it("displays section headers", () => {
    const { getByText } = render(<TopicsSection />);
    expect(getByText("INSIGHTS")).toBeInTheDocument();
    expect(getByText("AMERICA’S FINANCE GUIDE")).toBeInTheDocument();    
  });

  it("displays the afg book icon", () => {
    const { getByTestId } = render(<TopicsSection />);
    expect(getByTestId("afgBookIcon")).toBeInTheDocument();
  });

  it("has the AFG Header and AFG Tile Subheader", () => {
    const { getAllByText } = render(<TopicsSection />);
    expect(getAllByText("Your Guide to America’s Finances")).toHaveLength(1);
  });
});
