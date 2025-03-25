import { render } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import DataPreviewMobileDialog from '../data-preview-mobile-dialog/data-preview-mobile-dialog';
import React from 'react';

describe('Data preview mobile dialog component', () => {
  it('Renders the Filters header', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByRole('heading', { name: 'Filters', level: 3 })).toBeInTheDocument();
  });

  it('Renders the optional search bar', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByTestId('search-container')).toBeInTheDocument();
  });

  it('Renders the data preview (back) button', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Data Preview' })).toBeInTheDocument();
  });

  it('Renders the apply button', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('Renders the cancel button', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('Renders the filters scroll container', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DataPreviewMobileDialog />
      </RecoilRoot>
    );
    expect(getByTestId('filters-scroll-container')).toBeInTheDocument();
  });
});
