import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { nationalDebtExplainedTable } from '../national-debt.module.scss';
import NationalDebtExplained from './national-debt-explained';
import { nationalDebtExplainedTableContent } from './national-debt-explained-table/national-debt-explained-table';
import Analytics from '../../../../../utils/analytics/analytics';

describe('National Debt Explained', () => {
  const glossary = [];
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  it('renders the table showing a breakdown of how the national debt works', () => {
    const { container, getByText } = render(<NationalDebtExplained glossary={glossary} />);

    expect(container.querySelector(`.${nationalDebtExplainedTable}`)).toBeInTheDocument();

    nationalDebtExplainedTableContent.body.forEach(row => {
      row.forEach(col => {
        if (col !== null) {
          expect(getByText(col)).toBeInTheDocument();
        }
      });
    });
  });

  it('calls a ga event when the custom link is clicked ', async () => {
    const analyticsSpy = jest.spyOn(Analytics, 'event');
    const { getByRole } = render(<NationalDebtExplained glossary={glossary} />);

    const deficitLink = getByRole('link', { name: 'deficit' });
    fireEvent.click(deficitLink);
    expect(analyticsSpy).toHaveBeenCalledWith({
      action: 'Debt Citation Click',
      category: 'Explainers',
      label: 'National Deficit',
    });
  });
});
