import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { StickyFooterComponent } from './sticky-footer';
import * as styles from './sticky-footer.module.scss';

describe('StickyFooter component', () => {
  jest.useFakeTimers();
  const footerStyle = 'transition: max-height 3000ms linear 4500ms, visibility 0ms linear 7500ms';

  it('renders its children in an appropriately styled container', () => {
    const { getByTestId } = render(
      <StickyFooterComponent>
        <span data-testid="footer-childSpan">Some footer body text</span>
        <div data-testid="footer-childDiv">Some footer block</div>
      </StickyFooterComponent>
    );
    expect(getByTestId('sticky-footer-container')).toBeInTheDocument();
    expect(getByTestId('sticky-footer-container')).toHaveClass(styles.stickyFooterContainer);
    expect(getByTestId('footer-childSpan')).toBeInTheDocument();
    expect(getByTestId('footer-childDiv')).toBeInTheDocument();

    // No hide after time is specified, so no closing transition or class is applied.
    expect(getByTestId('sticky-footer-container')).not.toHaveStyle('transition: max-height 2000ms linear 4500ms, visibility 0ms linear 6500ms');
    expect(getByTestId('sticky-footer-container')).not.toHaveClass(styles.closing);
  });

  it('does not render if no children are present', () => {
    const { queryAllByTestId } = render(<StickyFooterComponent hideAfterTime={4500}></StickyFooterComponent>);
    expect(queryAllByTestId('sticky-footer-container')).toStrictEqual([]);
  });

  it('does not render if hidden prop is true', () => {
    const { queryAllByTestId } = render(<StickyFooterComponent hidden={true}>test content</StickyFooterComponent>);
    expect(queryAllByTestId('sticky-footer-container')).toStrictEqual([]);
  });

  it(`adds a transition to close after the appropriate number of millis if hideAfterTime is
    specified`, () => {
    let comp;
    act(() => {
      comp = render(
        <StickyFooterComponent hideAfterTime={4500}>
          <span data-testid="footer-childSpan">Some footer body text</span>
          <div data-testid="footer-childDiv">Some footer block</div>
        </StickyFooterComponent>
      );
      jest.advanceTimersByTime(100); // complete some initial render ticks
    });

    // Component is styled with a slow 3 sec slide down effect that starts after the delay specified
    // in hideAfterTime. Once the transition and delay are complete, make the container invisible.
    expect(comp.getByTestId('sticky-footer-container')).toHaveStyle(footerStyle);
  });

  it('executes an onClosed method if supplied a second after closure and transition out', () => {
    const mockOnClosedFn = jest.fn();
    act(() => {
      render(
        <StickyFooterComponent hideAfterTime={4500} onClosed={mockOnClosedFn}>
          <span data-testid="footer-childSpan">Some footer body text</span>
          <div data-testid="footer-childDiv">Some footer block</div>
        </StickyFooterComponent>
      );
      jest.advanceTimersByTime(4500 + 2900); // almost enough time to reach total closure
    });
    expect(mockOnClosedFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1500); // more than a second past total closure
    expect(mockOnClosedFn).toHaveBeenCalled();
  });

  it('executes an onClosed method if the component is unmounted before timed closure', () => {
    const mockOnClosedFn = jest.fn();

    const { unmount } = render(
      <StickyFooterComponent hideAfterTime={4500} onClosed={mockOnClosedFn}>
        <span data-testid="footer-childSpan">Some footer body text</span>
        <div data-testid="footer-childDiv">Some footer block</div>
      </StickyFooterComponent>
    );

    // closing timer just starting, so onClosed should not have been called
    expect(mockOnClosedFn).not.toHaveBeenCalled();

    unmount();

    // component unmounted, so the onClose callback should have been run
    expect(mockOnClosedFn).toHaveBeenCalled();
  });

  it('temporarily halts the slide-down transition upon interaction', () => {
    let component = null;
    act(() => {
      component = render(
        <StickyFooterComponent hideAfterTime={4500}>
          <span data-testid="footer-childSpan">Some footer body text</span>
          <div data-testid="footer-childDiv">Some footer block</div>
        </StickyFooterComponent>
      );
      jest.advanceTimersByTime(100); // complete some initial render ticks
    });
    // closing should be in progress from point of initial render
    expect(component.getByTestId('sticky-footer-container')).toHaveStyle(footerStyle);
    expect(component.getByTestId('sticky-footer-container')).toHaveClass(styles.closing);

    // interact (here using click, but component assigns same action to keyPress, touch and
    // focus events)
    fireEvent(
      component.getByTestId('sticky-footer-container'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    // closing momentarily no longer in progress
    expect(component.getByTestId('sticky-footer-container')).not.toHaveStyle(footerStyle);
    expect(component.getByTestId('sticky-footer-container')).not.toHaveClass(styles.closing);

    // after a half second, the closing class and transition with delay have been reapplied
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(component.getByTestId('sticky-footer-container')).toHaveStyle(footerStyle);
    expect(component.getByTestId('sticky-footer-container')).toHaveClass(styles.closing);
  });
});
