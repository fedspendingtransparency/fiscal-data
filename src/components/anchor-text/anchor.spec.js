import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AnchorText from './anchor-text';

jest.mock('../links/custom-link/custom-link', () => {
  return ({ onClick, children, 'data-testid': dataTestId }) => {
    return (
      <button onClick={onClick} data-testid={dataTestId}>
        {children}
      </button>
    );
  };
});

describe('AnchorText', () => {
  it('renders the Anchor Text component', () => {
    const { getByTestId } = render(<AnchorText link="testFootnote" text="Test Footnote Text" />);
    expect(getByTestId('anchor-text')).toBeInTheDocument();
  });

  it('calls onAnchorClick with the link when clicked', () => {
    const mockClickHandler = jest.fn();
    const { getByTestId } = render(<AnchorText link="testFootnote" text="Test Footnote Text" onAnchorClick={mockClickHandler} />);
    fireEvent.click(getByTestId('anchor-text'));

    expect(mockClickHandler).toHaveBeenCalledWith('testFootnote');
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});
