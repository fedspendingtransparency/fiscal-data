import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import DataPreviewDownloadSelect from './data-preview-download-select';
import userEvent from '@testing-library/user-event';
import { RecoilRoot } from 'recoil';

jest.mock('../../../../../variables.module.scss', () => {
  return {
    breakpointLg: '992',
  };
});

describe('Data preview download button', () => {
  let createObjectURL;

  beforeAll(() => {
    createObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn();
  });
  const mockDatasetConfig = { apis: [], name: 'Dataset name' };

  it('renders the desktop button default state', () => {
    const { getByRole } = render(<DataPreviewDownloadSelect width={1000} dataset={mockDatasetConfig} />, { wrapper: RecoilRoot });
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-down');
  });

  it('renders the mobile button default state', () => {
    const { getByRole } = render(<DataPreviewDownloadSelect width={500} dataset={mockDatasetConfig} />, { wrapper: RecoilRoot });
    expect(getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-right');
  });

  it('renders the desktop button active state', () => {
    const { getByRole, getAllByTestId } = render(<DataPreviewDownloadSelect width={1000} dataset={mockDatasetConfig} />, { wrapper: RecoilRoot });
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'caret-up');
    const downloadLinks = getAllByTestId('download-button');
    expect(within(downloadLinks[0]).getByText('CSV')).toBeInTheDocument();
    expect(within(downloadLinks[1]).getByText('JSON')).toBeInTheDocument();
    expect(within(downloadLinks[2]).getByText('XML')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Data Dictionary 1 KB' }));
  });

  it('calls downloadClickHandler on download button click', () => {
    const downloadClickHandlerSpy = jest.fn();
    const { getByRole, getAllByTestId } = render(
      <DataPreviewDownloadSelect width={1000} dataset={mockDatasetConfig} downloadClickHandler={downloadClickHandlerSpy} />,
      { wrapper: RecoilRoot }
    );
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    const downloadLinks = getAllByTestId('download-button');
    fireEvent.click(downloadLinks[0]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('csv');
    fireEvent.click(downloadLinks[1]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('json');
    fireEvent.click(downloadLinks[2]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('xml');

    fireEvent.click(getByRole('button', { name: 'Data Dictionary 1 KB' }));
  });

  it('renders the mobile button active state', () => {
    const { getByRole } = render(<DataPreviewDownloadSelect width={500} dataset={mockDatasetConfig} />, { wrapper: RecoilRoot });
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    expect(getByRole('img', { hidden: 'true' })).toHaveAttribute('data-icon', 'cloud-arrow-down');
  });
});
