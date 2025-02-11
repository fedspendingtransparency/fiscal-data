import { render } from '@testing-library/react';
import React from 'react';
import DataPreviewFilterSection from './data-preview-filter-section';
import { RecoilRoot } from 'recoil';

describe('Data preview filter section', () => {
  it('Renders all components', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewFilterSection dataset={{ name: 'Mock dataset' }} />
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Columns: 0/17' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Filters: 0 applied' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Table' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Chart' })).toBeInTheDocument();
  });
});
