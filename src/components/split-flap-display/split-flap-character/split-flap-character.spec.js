import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SplitFlapCharacter from "./split-flap-character";

describe('Split Flap Character', () => {

  it('transitions from previous value to current value', () => {
    const { getAllByText } =
      render(<SplitFlapCharacter value={'2'} prevValue={'1'} cycleDelay={100} />);

    // expecting 2 because there are 4 total elements that make up the split flap,
    // 2 flaps each for the previous and current values

    expect(getAllByText('2').length).toBe(2);
    expect(getAllByText('1').length).toBe(2);
  });

});
