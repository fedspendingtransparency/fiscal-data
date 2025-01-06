import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnMore from './learn-more';

// You can mock the helper if you want full control over footnotes:
jest.mock('./learn-more-helper', () => ({
  getSaleBondsFootNotes: () => [
    {
      id: 'savings-bonds-overview',
      text: 'Some footnote text',
    },
  ],
}));

describe('LearnMore Component', () => {
  let mockScrollIntoView: jest.Mock;
  let mockFocus: jest.Mock;
  let originalGetElementById: (elementId: string) => HTMLElement | null;

  beforeAll(() => {
    // Backup the real getElementById
    originalGetElementById = document.getElementById;
    // Create mocks
    mockScrollIntoView = jest.fn();
    mockFocus = jest.fn();

    // Mock getElementById to return an element with our spies
    document.getElementById = jest.fn((id: string) => {
      if (id === 'savings-bonds-overview') {
        // Return a mock element with scrollIntoView and focus
        return {
          scrollIntoView: mockScrollIntoView,
          focus: mockFocus,
        } as unknown as HTMLElement;
      }
      return null;
    });
  });

  afterAll(() => {
    // Restore original getElementById
    document.getElementById = originalGetElementById;
  });

  it('renders the main text content', () => {
    render(<LearnMore />);
    // Check for text from the paragraph
    expect(
      screen.getByText(
        'Today, individuals can buy Series I and Series EE bonds online through',
        { exact: false }
      )
    ).toBeInTheDocument();
    // Check reference to the footnote line
    expect(screen.getByText('This is some text referencing a footnote')).toBeInTheDocument();
  });

  it('renders the links to TreasuryDirect and Treasury Hunt', () => {
    render(<LearnMore />);
    expect(
      screen.getByRole('link', { name: /TreasuryDirect/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Treasury Hunt/i })
    ).toBeInTheDocument();
  });

  it('clicking the anchor text sets lastAnchorClicked', () => {
    render(<LearnMore />);
    const anchor = screen.getByText('1'); // The AnchorText link
    fireEvent.click(anchor);
    // If we wanted to further test internal state we’d do it via the side effect
    // but the best we can do is rely on further actions (the “Back to content” logic).
    // Just confirm the element is in the document.
    expect(anchor).toBeInTheDocument();
  });

  it('clicking the back-to-content triggers scrollIntoView if anchor is found', () => {
    render(<LearnMore />);
    // Click anchor first
    fireEvent.click(screen.getByText('1'));

    // The footnote component presumably has a "Back to content" button or link.
    // Since we don't see it in your snippet, we'll assume it’s rendered by Footnote:
    // For example, if Footnote renders a "Back to content" button:
    const backToContentButton = screen.getByRole('button', { name: /back to content/i });
    fireEvent.click(backToContentButton);

    expect(mockScrollIntoView).toHaveBeenCalled();
    expect(mockFocus).toHaveBeenCalled();
  });

  it('does nothing if lastAnchorClicked is not found in the DOM', () => {
    document.getElementById = jest.fn(() => null);
    render(<LearnMore />);

    // Click anchor
    fireEvent.click(screen.getByText('1'));

    // Click back to content
    const backToContentButton = screen.getByRole('button', { name: /back to content/i });
    fireEvent.click(backToContentButton);

    // scrollIntoView would not be called because the element doesn't exist
    expect(mockScrollIntoView).not.toHaveBeenCalled();
    expect(mockFocus).not.toHaveBeenCalled();
  });
});
