import React from 'react';
import { render } from '@testing-library/react';
import FilterButtons from './filter-buttons';

describe('Data Preview Dropdown Dialog', () => {
  it('renders the dropdown', () => {
    const instance = render(<FilterButtons />);
    expect(instance).toBeDefined();
  });
});
