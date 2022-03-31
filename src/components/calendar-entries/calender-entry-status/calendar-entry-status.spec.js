import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import CalendarEntryStatus from './calendar-entry-status';
import {render, cleanup, screen} from "@testing-library/react"

describe('calendar entry status', () => {

  it('shows correct text when is updated', () => {
    // destructuring allows for specific query functions to be made available
    // with the context of what was created in render
    const { getByText } = render(<CalendarEntryStatus isReleased={true} />);
    expect(getByText('Updated')).toBeInTheDocument();
    cleanup();
  });

  it('shows correct text when not updated', () => {
    const { getByText } = render(<CalendarEntryStatus isReleased={false} />);
    expect(getByText('Not yet updated')).toBeInTheDocument();
    cleanup();
  });

  it('updates to correct text when changed', () => {
    const { rerender } = render(<CalendarEntryStatus isReleased={false} />);

    expect(screen.getByText('Not yet updated')).toBeInTheDocument();

    rerender(<CalendarEntryStatus isReleased={true} />);
    expect(screen.getByText('Updated')).toBeInTheDocument();
    cleanup();
  });
});
