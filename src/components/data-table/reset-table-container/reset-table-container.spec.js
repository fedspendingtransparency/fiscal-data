import React from 'react';
import { render } from '@testing-library/react';
import ResetTableContainer from './reset-table-container';
import { RecoilRoot } from 'recoil';

describe('Reset table container', () => {
  it('renders the section', () => {
    const instance = render(
      <RecoilRoot>
        <ResetTableContainer tableProps={{}} rowsPerPage={10} />
      </RecoilRoot>
    );
    expect(instance).toBeTruthy();
  });

  it('renders the reset filters button', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <ResetTableContainer tableProps={{}} rowsPerPage={10} />
      </RecoilRoot>
    );
    const button = getByRole('button', { name: 'Reset Filters' });
    expect(button).toBeInTheDocument();
  });
});
