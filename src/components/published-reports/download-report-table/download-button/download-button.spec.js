import { act, fireEvent, render, waitFor } from '@testing-library/react';
import DownloadButton from './download-button';
import React from 'react';

describe('Download Table Button', () => {
  it('renders a short file name in the row', async () => {
    const { findByText } = render(<DownloadButton fileType=".txt" displayName={{ end: 'TST.txt' }} />);
    const downloadText = await waitFor(() => findByText('TST.txt'));
    expect(downloadText).toBeInTheDocument();
  });

  it('renders a pdf icon with a pdf filename', () => {
    const { getByAltText } = render(<DownloadButton fileType=".pdf" />);
    expect(getByAltText('.pdf icon')).toBeInTheDocument();
  });

  it('renders a xml icon with a xls filename', () => {
    const { getByAltText } = render(<DownloadButton fileType=".xml" />);
    expect(getByAltText('.xml icon')).toBeInTheDocument();
  });

  it('renders a txt icon with a txt filename', () => {
    const { getByAltText } = render(<DownloadButton fileType=".txt" />);
    expect(getByAltText('.txt icon')).toBeInTheDocument();
  });

  it('renders a xls icon with a xls filename', () => {
    const { getByAltText } = render(<DownloadButton fileType=".xls" />);
    expect(getByAltText('.xls icon')).toBeInTheDocument();
  });

  it('changes download icon color on click', () => {
    jest.useFakeTimers();
    const { getByRole, getByTestId, getByText } = render(
      <DownloadButton fileType=".pdf" fileName="file.pdf" displayName={{ end: 'Download file.pdf' }} url="/test/file/path/file.pdf" />
    );
    let icon = getByTestId('download-icon');
    expect(icon).not.toHaveClass('downloadedIcon');
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-cloud-arrow-down');

    const downloadButton = getByRole('link', { name: 'Download file.pdf' });
    act(() => {
      fireEvent.click(downloadButton);
      jest.runAllTimers();
    });
    //Changes download icon style and text after click
    icon = getByTestId('download-icon');
    expect(getByText('Downloaded')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-circle-check');
    expect(icon).toHaveClass('downloadedIcon');

    //Icon resets after 3 seconds
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    icon = getByTestId('download-icon');
    expect(icon).not.toHaveClass('downloadedIcon');
    expect(getByText('Download')).toBeInTheDocument();
    expect(getByRole('img', { hidden: true, name: '' })).toHaveClass('fa-cloud-arrow-down');
  });
});
