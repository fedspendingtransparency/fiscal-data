import React from 'react';
import GenerativeReportsAccountFilter from './generative-reports-account-filter';
import { act, fireEvent, render } from '@testing-library/react';

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
    const { getByRole } = render(<GenerativeReportsAccountFilter apiData={mockApiData} selectedAccount={{ label: defaultStr }} />);
    const dropdown = getByRole('button', { name: 'Account: (None selected)' });
    expect(dropdown).toBeInTheDocument();
  });

  it('Updates selected account on account option button click', () => {
    jest.useFakeTimers();
    const setSelectedAccountSpy = jest.fn();
    const { getByRole } = render(
      <GenerativeReportsAccountFilter apiData={mockApiData} selectedAccount={{ label: defaultStr }} setSelectedAccount={setSelectedAccountSpy} />
    );
    const dropdown = getByRole('button', { name: 'Account: (None selected)' });
    fireEvent.click(dropdown);
    const dropdownOption = getByRole('button', { name: 'two-1' });
    act(() => {
      fireEvent.click(dropdownOption);
      jest.runAllTimers();
    });
    expect(setSelectedAccountSpy).toHaveBeenCalledWith({ label: 'two-1', value: 'two-1' });
    expect(dropdownOption).not.toBeInTheDocument();
  });
});
