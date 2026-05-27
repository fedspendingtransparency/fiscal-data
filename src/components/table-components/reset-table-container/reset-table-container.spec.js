import React from 'react';
import { render } from '@testing-library/react';
import ResetTableContainer from './reset-table-container';

describe('Reset table container', () => {
  it('renders the section', () => {
    const instance = render(
      <>
        <ResetTableContainer tableProps={{ data: [], columnConfig: [] }} rowsPerPage={10} />
      </>
    );
    expect(instance).toBeTruthy();
  });

  it('renders the reset filters button', () => {
    const { getByRole } = render(
      <>
        <ResetTableContainer tableProps={{ data: [], columnConfig: [] }} rowsPerPage={10} />
      </>
    );
    const button = getByRole('button', { name: 'Reset Filters' });
    expect(button).toBeInTheDocument();
  });
});
