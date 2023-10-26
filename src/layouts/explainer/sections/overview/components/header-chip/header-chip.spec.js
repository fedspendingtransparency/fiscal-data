import HeaderChip from './header-chip';
import { render } from '@testing-library/react';
import React from 'react';

describe('header chip', () => {
  it('should render the chip', () => {
    const { getByText } = render(<HeaderChip text="test" color="#123456" />);
    const chip = getByText('test');
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveStyle({ backgroundColor: '#123456' });
  });
});
