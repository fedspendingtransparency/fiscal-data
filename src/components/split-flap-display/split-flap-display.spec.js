import React from 'react';
import SplitFlapDisplay from "./split-flap-display";
import { render, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

const breakpointLg = 993;

jest.mock("./split-flap-character/split-flap-character", function () {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(
      ({ cycleDelay, value, prevValue }) => <span>`${value}:${prevValue}`</span>
    )
  };
});
jest.mock("../../variables.module.scss", () => {
  return {
    breakpointLg: `${breakpointLg}px`
  }
});

jest.useFakeTimers();

const setWindowWidth = (width) => {
  // This isn't really a promise. Adding the usual async/awaits causes additional errors
  // to appear in teh console.
  act(() => {
    window.innerWidth = width;
    fireEvent(window, new Event('resize'));
    jest.runAllTimers();
  });
};

describe('Split Flap Display ', () => {

  it('starts with number of positions', () => {

    const { getAllByText } =
      render(
        <SplitFlapDisplay value={"10"}
                          minLength={5}
        />
      );

    setWindowWidth(1024);

    expect(getAllByText(/:/).length).toBe(5);
  });

  it('shows shortened number when width less than breakpoint', () => {
    const { getByTestId, getByText } =
      render(
        <SplitFlapDisplay value={"10000000.00"}
                          mobilePrecision={2}
                          minLength={21}
        />);

    setWindowWidth(800);

    expect(getByTestId('selectable-digits').textContent).toBe('$10.00');
    expect(getByText(/million/i)).toBeInTheDocument();
  });

  it('includes user selectable number for copying and pasting', () => {
    const { getByTestId } =
      render(
        <SplitFlapDisplay value={"1234567890"}
                          minLength={10}
        />);

    expect(getByTestId('selectable-digits').textContent).toBe('$1,234,567,890');
  });
});
