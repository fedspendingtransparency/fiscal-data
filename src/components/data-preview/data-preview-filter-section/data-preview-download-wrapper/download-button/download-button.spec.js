import React from 'react';
import { fireEvent, render, within } from '@testing-library/react';
import DownloadButton from './download-button';

describe('Download dialog', () => {
  it('renders CSV download button', () => {
    const { getByRole } = render(<DownloadButton label="CSV" fileType="csv" fileSize="5 KB" smallTableDownloadData={[['Test data']]} />);
    const downloadButton = getByRole('link', { hidden: true });
    const buttonText = within(downloadButton).getByText('CSV');
    expect(buttonText).toBeInTheDocument();
    fireEvent.click(downloadButton);
  });

  it('renders JSON download button', () => {
    const label = 'JSON';
    const { getByRole } = render(<DownloadButton label={label} fileType="json" fileSize="5 KB" smallTableDownloadData={[['Test data']]} />);
    const downloadButton = getByRole('link', { hidden: true });
    const buttonText = within(downloadButton).getByText(label);
    expect(buttonText).toBeInTheDocument();
    fireEvent.click(downloadButton);
  });

  it('renders XML download button', () => {
    const label = 'XML';
    const { getByRole } = render(<DownloadButton label={label} fileType="xml" fileSize="5 KB" smallTableDownloadData={[['Test data']]} />);
    const downloadButton = getByRole('link', { hidden: true });
    const buttonText = within(downloadButton).getByText(label);
    expect(buttonText).toBeInTheDocument();
    fireEvent.click(downloadButton);
  });

  it('renders disabled download button', () => {
    const label = 'XML';
    const { getByRole } = render(<DownloadButton label={label} disabled fileType="xml" fileSize="5 KB" smallTableDownloadData={[['Test data']]} />);
    const downloadButton = getByRole('button', { hidden: true });
    const buttonText = within(downloadButton).getByText(label);
    expect(buttonText).toBeInTheDocument();
    expect(downloadButton).toBeDisabled();
  });

  it('renders data dictionary download button', () => {
    const label = 'Data Dictionary';
    const { getByRole } = render(
      <DownloadButton label={label} fileType="data-dictionary" fileSize="5 KB" smallTableDownloadData={[['Test data']]} />
    );
    const downloadButton = getByRole('button', { hidden: true });
    const buttonText = within(downloadButton).getByText(label);
    expect(buttonText).toBeInTheDocument();
  });

  it('renders large table download button', () => {
    const label = 'CSV';
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <DownloadButton label={label} fileType="csv" fileSize="5 KB" smallTableDownloadData={null} handleClick={handleClick} />
    );
    const downloadButton = getByTestId('download-button');
    const buttonText = within(downloadButton).getByText(label);
    expect(buttonText).toBeInTheDocument();
    fireEvent.click(downloadButton);
    expect(handleClick).toHaveBeenCalled();
  });

  it('does not show the file sizes for large datasets', () => {
    const label = 'CSV';
    const handleClick = jest.fn();
    const { getByTestId } = render(
      <DownloadButton label={label} fileType="csv" fileSize="5 KB" smallTableDownloadData={null} handleClick={handleClick} />
    );
    const downloadButton = getByTestId('download-button');
    const buttonContents = within(downloadButton);
    expect(buttonContents.queryByText('5 KB')).not.toBeInTheDocument();
  });
});
