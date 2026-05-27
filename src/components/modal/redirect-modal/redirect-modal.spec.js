import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RedirectModal from './redirect-modal';

jest.mock('../modal', () => ({
  __esModule: true,
  default: ({ open, children }) => (open ? <div data-testid="mock-modal">{children}</div> : null),
}));

describe('<RedirectModal />', () => {
  const url = 'https://example.com/';
  const noop = () => {};

  it('renders nothing when isOpen is false', () => {
    const { queryByTestId } = render(<RedirectModal isOpen={false} url={url} onClose={noop} onProceed={noop} />);
    expect(queryByTestId('mock-modal')).toBeNull();
  });

  it('renders banner, text, link, and close button when open', () => {
    const { getByText, getByRole, getByTestId } = render(<RedirectModal isOpen url={url} onClose={noop} onProceed={noop} />);

    expect(getByTestId('mock-modal')).toBeInTheDocument();
    expect(getByText(/You’re leaving a Federal Government website/i)).toBeInTheDocument();
    expect(getByRole('link', { name: url })).toBeInTheDocument();
    expect(getByRole('button', { name: /close modal/i })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    const handleClose = jest.fn();

    const { getByRole } = render(<RedirectModal isOpen url={url} onClose={handleClose} onProceed={noop} />);

    fireEvent.click(getByRole('button', { name: /close modal/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onProceed when the external link is clicked', () => {
    const handleProceed = jest.fn();

    const { getByRole } = render(<RedirectModal isOpen url={url} onClose={noop} onProceed={handleProceed} />);

    fireEvent.click(getByRole('link'));
    expect(handleProceed).toHaveBeenCalledTimes(1);
  });
});
