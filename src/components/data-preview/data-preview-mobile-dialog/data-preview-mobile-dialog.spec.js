import { render } from '@testing-library/react';
import DataPreviewMobileDialog from '../data-preview-mobile-dialog/data-preview-mobile-dialog';
import React from 'react';

describe('Data preview mobile dialog component', () => {
  it('Renders the Filters header', () => {
    const { getByText } = render(
      <>
        <DataPreviewMobileDialog filterName="Filters" />
      </>
    );
    expect(getByText('Filters')).toBeInTheDocument();
  });

  it('Renders the optional search bar', () => {
    const { getByRole, getByText } = render(
      <>
        <DataPreviewMobileDialog searchText="Search filters" active={true} />
      </>
    );
    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByText('Search filters')).toBeInTheDocument();
  });

  it('Renders the data preview (back) button', () => {
    const { getByRole } = render(
      <>
        <DataPreviewMobileDialog active={true} />
      </>
    );
    expect(getByRole('button', { name: 'Data Preview' })).toBeInTheDocument();
  });

  it('Renders the apply button', () => {
    const { getByRole } = render(
      <>
        <DataPreviewMobileDialog active={true} />
      </>
    );
    expect(getByRole('button', { name: 'Apply' })).toBeInTheDocument();
  });

  it('Renders the cancel button', () => {
    const { getByRole } = render(
      <>
        <DataPreviewMobileDialog active={true} />
      </>
    );
    expect(getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('Renders the filters scroll container', () => {
    const { getByTestId } = render(
      <>
        <DataPreviewMobileDialog />
      </>
    );
    expect(getByTestId('filters-scroll-container')).toBeInTheDocument();
  });
});
