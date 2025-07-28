import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TOCButton from './toc-button';

describe('TocButton when tocIsOpen is false', () => {
  // this must return undefined or a promise, or we get a console warning
  it('creates a button that displays the text "Table of Contents', async () => {
    const handleToggle = jest.fn().mockReturnValue(undefined);
    render(<TOCButton handleToggle={handleToggle} state={false} />);

    const btn = screen.getByRole('button', { name: /Table of Contents/i });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});

describe('TocButton when tocIsOpen is true', () => {
  it('creates a button with the text "Cancel"', async () => {
    const handleToggle = jest.fn();
    render(<TOCButton handleToggle={handleToggle} state={true} />);

    const btn = screen.getByRole('button', { name: 'Cancel' });
    expect(btn).toBeInTheDocument();
    btn.focus();
    expect(btn).toHaveFocus();

    await userEvent.click(btn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
