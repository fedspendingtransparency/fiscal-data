import React from 'react';
import DownloadToggle from './download-toggle';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('DownloadToggle', () => {
  const toggleFn = jest.fn();
  const setSelectedFileTypeMock = jest.fn();
  const setDisableDownloadBannerMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('contains three radio buttons', () => {
    const { getAllByRole } = render(<DownloadToggle onChange={toggleFn} setDisableDownloadBanner={setDisableDownloadBannerMock} />);
    const radioButtons = getAllByRole('radio');
    expect(radioButtons).toHaveLength(3);
  });

  it('defaults to having the first radio button selected', () => {
    const { getAllByRole } = render(
      <DownloadToggle onChange={toggleFn} setDisableDownloadBanner={setDisableDownloadBannerMock} selectedFileType="csv" />
    );
    const radioButtons = getAllByRole('radio');
    expect(radioButtons[0]).toBeChecked();
  });

  it(`when a radio button is clicked, it updates the selected button and calls the onChange function
    with the radio button value`, async () => {
    const { getAllByRole } = render(
      <DownloadToggle
        onChange={toggleFn}
        setSelectedFileType={setSelectedFileTypeMock}
        setDisableDownloadBanner={setDisableDownloadBannerMock}
        selectedFileType="csv"
      />
    );
    const radioButtons = getAllByRole('radio');

    await userEvent.click(radioButtons[1]);

    expect(setSelectedFileTypeMock).toHaveBeenCalledWith('json');
    expect(toggleFn).toHaveBeenCalledWith('json');

    userEvent.click(radioButtons[2]);

    expect(setSelectedFileTypeMock).toHaveBeenCalledWith('xml');
    expect(toggleFn).toHaveBeenCalledWith('xml');

    userEvent.click(radioButtons[0]);

    expect(setSelectedFileTypeMock).toHaveBeenCalledWith('csv');
    expect(toggleFn).toHaveBeenCalledWith('csv');
  });

  it('disables large XML download', () => {
    const downloadLimit = {
      fileType: 'xml',
      maxYearRange: 5,
    };

    const { getByRole } = render(
      <DownloadToggle
        onChange={toggleFn}
        downloadLimit={downloadLimit}
        setDisableDownloadBanner={jest.fn()}
        dateRange={{ from: new Date('1/1/19'), to: new Date('1/1/25') }}
        setSelectedFileType={setSelectedFileTypeMock}
        selectedFileType="xml"
      />
    );
    const xmlButton = getByRole('radio', { name: 'XML' });
    expect(xmlButton).toBeDisabled();
    expect(setSelectedFileTypeMock).toHaveBeenCalledWith('csv');
  });
});
