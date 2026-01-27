import React from 'react';
import { render } from '@testing-library/react';
import MenuButton from './menu-button';

describe('MenuButton', () => {
  it('renders a button which contains the word menu', () => {
    const { getByTestId } = render(<MenuButton />);

    expect(getByTestId('button')).toBeDefined();
    expect(getByTestId('menuText')).toBeDefined();
  });

  // it('renders a div which contains the menuIcon', () => {
  //   const { getByTestId } = render(<MenuButton />);
  //
  //   expect(getByTestId('menuIcon')).toBeDefined();
  // });
});
