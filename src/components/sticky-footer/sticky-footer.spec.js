import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { StickyFooterComponent, stickySlideDownTransitionMillis } from './sticky-footer';
import { closingStyle, stickyFooterContainer } from './sticky-footer.module.scss';

const footerStyle = 'transition: max-height 3000ms linear 4500ms, visibility 0ms linear 7500ms';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('StickyFooterComponent (React 18)', () => {
  it('renders its children in an appropriately styled container', () => {
    render(
      <StickyFooterComponent>
        <span data-testid="footer-childSpan">Some footer body text</span>
        <div data-testid="footer-childDiv">Some footer block</div>
      </StickyFooterComponent>
    );

    const container = screen.getByTestId('sticky-footer-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(stickyFooterContainer);
    expect(screen.getByTestId('footer-childSpan')).toBeInTheDocument();
    expect(screen.getByTestId('footer-childDiv')).toBeInTheDocument();

    expect(container).not.toHaveStyle(footerStyle);
    expect(container).not.toHaveClass(closingStyle);
  });

  it('does not render if no children are present', () => {
    render(<StickyFooterComponent hideAfterTime={4500} />);
    expect(screen.queryByTestId('sticky-footer-container')).toBeNull();
  });

  it('does not render if hidden prop is true', () => {
    render(<StickyFooterComponent hidden>test content</StickyFooterComponent>);
    expect(screen.queryByTestId('sticky-footer-container')).toBeNull();
  });

  it('adds a transition to close after the appropriate number of millis if hideAfterTime is specified', () => {
    render(
      <StickyFooterComponent hideAfterTime={4500}>
        <span data-testid="footer-childSpan">Some footer body text</span>
        <div data-testid="footer-childDiv">Some footer block</div>
      </StickyFooterComponent>
    );

    act(() => {
      jest.advanceTimersByTime(4500);
    });

    const container = screen.getByTestId('sticky-footer-container');
    expect(container).toHaveStyle(footerStyle);
  });

  it('executes an onClosed method if supplied a second after closure and transition out', () => {
    const mockOnClosed = jest.fn();
    render(
      <StickyFooterComponent hideAfterTime={4500} onClosed={mockOnClosed}>
        <span>Test</span>
      </StickyFooterComponent>
    );

    act(() => {
      jest.advanceTimersByTime(1);
    });
    act(() => {
      jest.advanceTimersByTime(4500 + stickySlideDownTransitionMillis + 1000);
    });

    expect(mockOnClosed).toHaveBeenCalledTimes(1);
  });

  it('executes an onClosed method if the component is unmounted before timed closure', () => {
    const mockOnClosed = jest.fn();
    const { unmount } = render(
      <StickyFooterComponent hideAfterTime={4500} onClosed={mockOnClosed}>
        <span data-testid="footer-childSpan">Some footer body text</span>
        <div data-testid="footer-childDiv">Some footer block</div>
      </StickyFooterComponent>
    );

    // closing timer just starting, so onClosed should not have been called
    expect(mockOnClosed).not.toHaveBeenCalled();

    unmount();
    expect(mockOnClosed).toHaveBeenCalledTimes(1);
  });

  it('temporarily halts the slide-down transition upon interaction', () => {
    render(
      <StickyFooterComponent hideAfterTime={4500}>
        <span>Test</span>
      </StickyFooterComponent>
    );

    act(() => jest.advanceTimersByTime(4500));
    // after a half second, the closing class and transition with delay have been reapplied
    const container = screen.getByTestId('sticky-footer-container');
    expect(container).toHaveStyle(footerStyle);
    expect(container).toHaveClass(closingStyle);

    userEvent.click(container);
    userEvent.unhover(container);

    expect(container).not.toHaveStyle(footerStyle);
    expect(container).not.toHaveClass(closingStyle);

    act(() => jest.advanceTimersByTime(500));

    expect(container).toHaveStyle(footerStyle);
    expect(container).toHaveClass(closingStyle);
  });
});
