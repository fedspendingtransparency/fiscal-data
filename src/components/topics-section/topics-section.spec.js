import React from "react";
import { render } from "@testing-library/react";
import { TopicsSection } from "./topics-section";

global.___loader = {
  enqueue: jest.fn(),
};

describe("Topics section", () => {
  it("displays section headers", () => {
    const { getByText } = render(<TopicsSection />);
    expect(getByText("TOOLS")).toBeInTheDocument();
  });

  it("displays the title with the book icon", () => {
    const { getByRole } = render(<TopicsSection />);
    expect(
      getByRole("img", { hidden: true }, { name: "book-open" })
    ).toBeInTheDocument();
  });

  it("has the AFG Header and AFG Tile Subheader", () => {
    const { getByText } = render(<TopicsSection />);
    expect(getByText("Your Guide to America’s Finances")).toBeInTheDocument();
  });
});
