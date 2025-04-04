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

describe('DataPreviewDownloadSelect', () => {
  let originalCreateObjectURL = global.URL.createObjectURL;
  let originalRevokeObjectURL = global.URL.revokeObjectURL;

  beforeAll(() => {
    originalCreateObjectURL = global.URL.createObjectURL;
    originalRevokeObjectURL = global.URL.revokeObjectURL;
    global.URL.createObjectURL = jest.fn(() => 'blob:url');
    global.URL.revokeObjectURL = jest.fn();
  });

  const mockDatasetConfig = { apis: [], name: 'Dataset name' };

  afterAll(() => {
    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });

  const mockDataset = { apis: [], name: 'Dataset name', downloadTimestamp: 'timestamp' };
  const mockDateRange = { from: new Date('2023-01-01'), to: new Date('2023-01-02') };
  const mockSelectedTable = { id: 1, name: 'Table 1' };
  const mockSelectedPivot = {};
  const defaultProps = {
    dateRange: mockDateRange,
    selectedTable: mockSelectedTable,
    dataset: mockDataset,
    selectedPivot: mockSelectedPivot,
    allTablesSelected: false,
    downloadClickHandler: jest.fn(),
    isDisabled: false,
  };

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

  it('calls downloadClickHandler on desktop download button click', () => {
    const downloadClickHandlerSpy = jest.fn();
    const props = { ...defaultProps, downloadClickHandler: downloadClickHandlerSpy };
    const { getByRole, getAllByTestId } = render(<DataPreviewDownloadSelect width={1000} {...props} />, { wrapper: RecoilRoot });
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    const downloadLinks = getAllByTestId('download-button');
    fireEvent.click(downloadLinks[0]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('csv', null);
    fireEvent.click(downloadLinks[1]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('json', null);
    fireEvent.click(downloadLinks[2]);
    expect(downloadClickHandlerSpy).toHaveBeenCalledWith('xml', null);
    fireEvent.click(getByRole('button', { name: /Data Dictionary/ }));
  });

  it('renders the mobile button active state and shows mobile options', async () => {
    const { getByRole, findByText } = render(<DataPreviewDownloadSelect width={500} {...defaultProps} />, { wrapper: RecoilRoot });
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);
    expect(getByRole('img', { hidden: true })).toHaveAttribute('data-icon', 'cloud-arrow-down');
    expect(await findByText('CSV')).toBeInTheDocument();
    expect(await findByText('JSON')).toBeInTheDocument();
    expect(await findByText('XML')).toBeInTheDocument();
    expect(await findByText('Data Dictionary')).toBeInTheDocument();
  });

  it('triggers direct download on mobile when a radio option is selected and Download is clicked', async () => {
    const { getByRole, findByText } = render(<DataPreviewDownloadSelect width={500} {...defaultProps} />, { wrapper: RecoilRoot });
    const button = getByRole('button', { name: 'Download' });
    userEvent.click(button);

    const csvRadio = await findByText('CSV');
    userEvent.click(csvRadio);

    const mobileDownloadButton = getByRole('button', { name: 'Download' });
    userEvent.click(mobileDownloadButton);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
