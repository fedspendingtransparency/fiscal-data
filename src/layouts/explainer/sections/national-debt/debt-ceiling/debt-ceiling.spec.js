import {render} from "@testing-library/react";
import DebtCeilingSection from "./debt-ceiling";
import React from "react";

const debtCeilingSectionAccordionTitle =
  "How is the debt ceiling different from a government shutdown?"

describe('The Debt Ceiling', () => {
  it('contains an accordion', () => {
    const { getByText } = render(
      <DebtCeilingSection />
    );

    expect(getByText(debtCeilingSectionAccordionTitle)).toBeInTheDocument();
  });
});
