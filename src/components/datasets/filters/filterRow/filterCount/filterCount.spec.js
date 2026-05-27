import React from 'react';
import FilterCount from './filterCount';
import { render } from '@testing-library/react';

const maxWidth = 40;

describe('filter count', () => {
  it('displays the number passed to it', () => {
    const { getByText } = render(
      <FilterCount
        count={{
          count: 5,
          of: 18,
        }}
      />
    );
    expect(getByText('5')).toBeInTheDocument();
  });

  it('sets the bar styles', () => {
    const { getByTestId } = render(
      <FilterCount
        count={{
          count: 5,
          of: 18,
        }}
      />
    );
    const bar = getByTestId('filter-count-bar');
    expect(bar).toHaveStyle({ width: '28%', minWidth: '12px' });
  });

  it('sets minWidth to zero when there are no matches', () => {
    const { getByTestId } = render(
      <FilterCount
        count={{
          count: 0,
          of: 18,
        }}
      />
    );
    const bar = getByTestId('filter-count-bar');
    expect(bar).toHaveStyle({ minWidth: 0 });
  });

  it('raises minWidth when count is two digits', () => {
    const { getByTestId } = render(
      <FilterCount
        count={{
          count: 10,
          of: 18,
        }}
      />
    );
    const bar = getByTestId('filter-count-bar');
    expect(bar).toHaveStyle({ minWidth: '19px' });
  });
});
