import React from 'react';
import { render, act } from '@testing-library/react';
import CustomBar from './customBar';
import { useSpring } from '@react-spring/web';

jest.useFakeTimers();

jest.mock('../../../national-debt.module.scss', () => ({
  boldWeight: 700,
  fontBodyCopy: '#111',
  fontSize_36: '36px',
}));

jest.mock('@react-spring/web', () => {
  const React = require('react');
  return {
    animated: {
      rect: ({ style, ...rest }) => <rect {...rest} data-testid="animated-rect" />,
    },
    useSpring: jest.fn(() => ({})),
  };
});

describe('CustomBar', () => {
  let ioInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    global.IntersectionObserver = jest.fn(function(cb) {
      this._cb = cb;
      this.observe = jest.fn();
      this.disconnect = jest.fn();
      ioInstance = this;
    });

    document.body.innerHTML = `<div data-testid="breakdownChart"></div>`;
  });

  const makeBar = ({
    key = 'Intragovernmental Holdings',
    index = 0,
    value = 10.2560154323853,
    x = 10,
    y = 20,
    width = 30,
    height = 40,
    holdingsDuration = 1000,
    debtDuration = 2000,
  } = {}) => ({
    x,
    y,
    width,
    height,
    color: '#f00',
    key,
    data: {
      index,
      value,
      data: {
        holdings_animation_duration: holdingsDuration,
        debt_animation_duration: debtDuration,
      },
    },
  });

  it('renders the marker text with opacity 0 initially', () => {
    const bar = makeBar({ value: 10.2560154323853 });

    const { getByText } = render(
      <svg>
        <CustomBar bar={bar} />
      </svg>
    );

    expect(getByText('$10.26 T')).toHaveStyle({ opacity: 0 });
  });

  it('positions label left when index is falsy and right when index is truthy', () => {
    const barLeft = makeBar({ index: 0, x: 10, width: 30, y: 20, value: 4.73769361275732 });
    const barRight = makeBar({ index: 1, x: 10, width: 30, y: 20, value: 10.3899577807415 });

    const { getByText, rerender } = render(
      <svg>
        <CustomBar bar={barLeft} />
      </svg>
    );

    const leftText = getByText('$4.74 T');
    expect(leftText.getAttribute('x')).toBe(String(10 - 18));
    expect(leftText.getAttribute('y')).toBe(String(20 + 35));

    rerender(
      <svg>
        <CustomBar bar={barRight} />
      </svg>
    );

    const rightText = getByText('$10.39 T');
    expect(rightText.getAttribute('x')).toBe(String(10 + 30 + 17));
    expect(rightText.getAttribute('y')).toBe(String(20 + 35));
  });

  it('uses the holdings spring duration when key is NOT Debt Held by the Public', () => {
    const bar = makeBar({ key: 'Intragovernmental Holdings', holdingsDuration: 1111 });

    render(
      <svg>
        <CustomBar bar={bar} />
      </svg>
    );

    expect(useSpring).toHaveBeenCalledWith(
      expect.objectContaining({
        config: expect.objectContaining({ duration: 1111 }),
      })
    );
  });

  it('uses the debt spring duration and delay when key IS Debt Held by the Public', () => {
    const bar = makeBar({
      key: 'Debt Held by the Public',
      holdingsDuration: 1500,
      debtDuration: 2500,
    });

    render(
      <svg>
        <CustomBar bar={bar} />
      </svg>
    );

    const secondCallArgs = useSpring.mock.calls[1][0];

    expect(secondCallArgs.config).toEqual(expect.objectContaining({ duration: 2500 }));
    expect(secondCallArgs.delay).toBe(1500 + 1000);
  });

  it('on intersection: unpauses animation and fades text in after the holdings delay', () => {
    const bar = makeBar({
      key: 'Intragovernmental Holdings',
      holdingsDuration: 1200,
      value: 4.72054076767472,
    });

    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    const { getByText } = render(
      <svg>
        <CustomBar bar={bar} />
      </svg>
    );

    expect(global.IntersectionObserver).toHaveBeenCalled();
    expect(ioInstance.observe).toHaveBeenCalledWith(document.querySelector('[data-testid="breakdownChart"]'));

    act(() => {
      ioInstance._cb([{ isIntersecting: true }]);
    });

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), [1200 + 250]);

    act(() => {
      jest.runAllTimers();
    });

    expect(getByText('$4.72 T')).toHaveStyle({ opacity: 1 });

    const lastCallArgs = useSpring.mock.calls[useSpring.mock.calls.length - 1][0];
    expect(lastCallArgs.pause).toBe(false);

    timeoutSpy.mockRestore();
  });

  it('on intersection: debt label uses the combined delay (holdings + debt + 1250)', () => {
    const bar = makeBar({
      key: 'Debt Held by the Public',
      holdingsDuration: 1000,
      debtDuration: 2000,
      value: 10.2560154323853,
    });

    const timeoutSpy = jest.spyOn(global, 'setTimeout');

    render(
      <svg>
        <CustomBar bar={bar} />
      </svg>
    );

    act(() => {
      ioInstance._cb([{ isIntersecting: true }]);
    });

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), [1000 + 2000 + 1250]);

    timeoutSpy.mockRestore();
  });
});
