import React from 'react';
import { render } from '@testing-library/react';
import EntryBoxLabel from './entry-box-label';
import userEvent from '@testing-library/user-event';

describe('Entry Box Label', () => {
  it('renders the entry box label with a tooltip', () => {
    jest.useFakeTimers();
    const { getByRole, getByText } = render(
      <EntryBoxLabel label="Test Label" tooltipBody={<>Tooltip body</>} handleMouseEnter={jest.fn()} handleTooltipClose={jest.fn()} />
    );
    const tooltipButton = getByRole('button', { name: 'More information about Test Label.' });
    expect(tooltipButton).toBeInTheDocument();
    userEvent.hover(tooltipButton);
    jest.advanceTimersByTime(3000);
    // expect(getByText('Tooltip body')).toBeInTheDocument();
  });
  //
  // it('renders the entry box label without a tooltip', () => {
  //   const { queryByRole } = render(<EntryBoxLabel label="Test Label" handleMouseEnter={jest.fn()} handleTooltipClose={jest.fn()} />);
  //   expect(queryByRole('button', { name: 'More information about Test Label.' })).not.toBeInTheDocument();
  // });
});
