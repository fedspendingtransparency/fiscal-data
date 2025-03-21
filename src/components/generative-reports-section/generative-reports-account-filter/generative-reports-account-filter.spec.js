import React from 'react';
import GenerativeReportsAccountFilter from './generative-reports-account-filter';
import { render } from '@testing-library/react';

describe('Generative Report Account Filter', () => {
  const mockApiData = [
    {
      apiFilter: {
        fieldFilter: {
          value: ['One', 'Two'],
        },
        optionValues: {
          One: ['one-1', 'one-2'],
          Two: ['two-1', 'two-2'],
        },
      },
    },
    {
      apiFilter: {
        fieldFilter: {
          value: ['Two', 'Three'],
        },
        optionValues: {
          Two: ['two-1', 'two-2'],
          Three: ['three-1', 'three-2'],
        },
      },
    },
  ];

  const defaultStr = '(None selected)';

  it('renders a dropdown', () => {
    const { getByText } = render(<GenerativeReportsAccountFilter apiData={mockApiData} />);
    expect(getByText(defaultStr)).toBeInTheDocument();
  });
});
