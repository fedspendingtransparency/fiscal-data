import React from 'react';
import {render} from "@testing-library/react";
import {
  nationalDebtExplainedTable
} from '../national-debt.module.scss';
import NationalDebtExplained from "./national-debt-explained";
import {
  nationalDebtExplainedTableContent
} from "./national-debt-explained-table/national-debt-explained-table";
describe('National Debt Explained', () => {
  const glossary = [];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  it('renders the table showing a breakdown of how the national debt works', () => {
    const { container, getByText } = render(<NationalDebtExplained glossary={glossary} />);

    expect(container.querySelector(`.${nationalDebtExplainedTable}`)).toBeInTheDocument();

    nationalDebtExplainedTableContent.body.forEach((row) => {
      row.forEach((col) => {
        if (col !== null) {
          expect(getByText(col)).toBeInTheDocument();
        }
      });
    });
  });

});
