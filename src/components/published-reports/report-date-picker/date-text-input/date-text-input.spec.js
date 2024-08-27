import DateTextInput from './date-text-input';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('Date Text Entry', () => {
  it('displays input label', () => {
    const { getByText } = render(<DateTextInput label="Report Date" />);
    expect(getByText('Report Date')).toBeInTheDocument();
  });

  it('renders an input box', () => {
    const { getByRole } = render(<DateTextInput label="Report Date" />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('display help text when focus is on input field', () => {
    const { getByRole, getByText } = render(<DateTextInput label="Report Date" />);
    const inputBox = getByRole('textbox');
    fireEvent.focus(inputBox);
    expect(getByText('Press Enter/Return to confirm.'));
  });
});
