import { act, render } from '@testing-library/react';
import ResumeDownloadModal, {
  resumeCompletedDownloadSubtitle,
  resumeCompletedDownloadTitle,
  resumeDownloadSubtitle,
  resumeDownloadSubtitleMulti,
  resumeDownloadTitle,
  resumeDownloadTitleMulti,
} from './resume-download-modal';
import React from 'react';
import { downloadsContext } from '../../persist/download-persist/downloads-persist';

describe('resume download modal (with react testing-library)', () => {
  const mockDownloadPrepared = [
    {
      datasetId: '015-BFS-2014Q1-xx',
      dateRange: { from: '2016-08-16T05:00:00.000Z', to: '2019-09-01T05:00:00.000Z' },
      downloadUrl: '/static-data/downloads/zip/1234/TOP_FedClct_20160816_20190901.zip',
      status_path: '/static-data/downloads/zip/1f32e7ebbb2d3c7764f653069c22c1d904a9a6d869fbb82b547218a17c1f2983/status.json',
      filename: 'TOP_FedClct_20160816_20190901.zip',
      prepStarted: true,
      requestId: '015-BFS-2014Q1-xx::1624547011623',
      selectedFileType: 'csv',
      status: 'completed',
      statusPath: 'http://localhost:8000/downloads/1f32e7ebbb2d3c7764f653069c22c1d904a9a6d869fbb82b547218a17c1f2983',
    },
  ];

  const mockSiteProviderValuePrepared = {
    resumedDownloads: mockDownloadPrepared,
    resumeDownloadModalIsOpen: true,
    setResumeDownloadModalIsOpen: () => {},
    setCancelDownloadRequest: () => {},
  };

  const mockDownloadInProgress = [
    {
      datasetId: '015-BFS-2014Q1-xx',
      dateRange: { from: '2016-08-16T05:00:00.000Z', to: '2019-09-01T05:00:00.000Z' },
      downloadUrl: '/static-data/downloads/zip/1234/TOP_FedClct_20160816_20190901.zip',
      status_path: '/static-data/downloads/zip/1f32e7ebbb2d3c7764f653069c22c1d904a9a6d869fbb82b547218a17c1f2983/status.json',
      filename: 'TOP_FedClct_20160816_20190901.zip',
      prepStarted: true,
      requestId: '015-BFS-2014Q1-xx::1624547011623',
      selectedFileType: 'csv',
      status: 'started',
      statusPath: 'http://localhost:8000/downloads/1f32e7ebbb2d3c7764f653069c22c1d904a9a6d869fbb82b547218a17c1f2983',
    },
  ];

  const mockSiteProviderValueInProgress = {
    resumedDownloads: mockDownloadInProgress,
    resumeDownloadModalIsOpen: true,
    setResumeDownloadModalIsOpen: () => {},
    setCancelDownloadRequest: () => {},
  };

  const mockSiteProviderValueMulti = {
    resumedDownloads: mockDownloadPrepared.concat(mockDownloadInProgress),
    resumeDownloadModalIsOpen: true,
    setResumeDownloadModalIsOpen: () => {},
    setCancelDownloadRequest: () => {},
  };

  it('when a single download is present and prepared, renders appropriate title and subtitle and buttons', () => {
    const { queryByText, getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValuePrepared}>
        <ResumeDownloadModal />
      </downloadsContext.Provider>
    );
    expect(queryByText(resumeCompletedDownloadTitle)).toBeTruthy();
    expect(queryByText(resumeDownloadTitle)).toBeFalsy();
    expect(queryByText(resumeCompletedDownloadSubtitle)).toBeTruthy();
    expect(queryByText(resumeDownloadSubtitle)).toBeFalsy();
    expect(getByTestId('direct-cancel-button')).toBeDefined();
    expect(getByTestId('direct-download-button')).toBeDefined();
  });

  it('carries out the correct action when the direct cancel button is clicked', () => {
    const cancelDownloadSpy = jest.spyOn(mockSiteProviderValuePrepared, 'setCancelDownloadRequest');

    const { getByText, queryAllByText } = render(
      <downloadsContext.Provider value={mockSiteProviderValuePrepared}>
        <ResumeDownloadModal />
      </downloadsContext.Provider>
    );
    expect(queryAllByText(resumeCompletedDownloadTitle).length).toBeTruthy();
    const cancelButton = getByText('Cancel Download');

    act(() => {
      cancelButton.click();
    });

    expect(cancelDownloadSpy).toHaveBeenCalledWith(mockDownloadPrepared[0]);
  });

  it('when a single download is present and still preparing, renders appropriate title and subtitle', () => {
    const { queryByText, queryByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValueInProgress}>
        <ResumeDownloadModal />
      </downloadsContext.Provider>
    );
    expect(queryByText(resumeDownloadTitle)).toBeTruthy();
    expect(queryByText(resumeCompletedDownloadTitle)).toBeFalsy();
    expect(queryByText(resumeDownloadSubtitle)).toBeTruthy();
    expect(queryByText(resumeCompletedDownloadSubtitle)).toBeFalsy();
    expect(queryByTestId('direct-cancel-button')).toBeFalsy();
    expect(queryByTestId('direct-download-button')).toBeFalsy();
  });

  it('when a single download is present and still preparing, renders a DownloadModalItems container ', () => {
    const { queryByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValueInProgress}>
        <ResumeDownloadModal />
      </downloadsContext.Provider>
    );
    expect(queryByTestId('download-items-container')).toBeDefined();
  });

  it('when multiple downloads are present, renders appropriate title and subtitle and buttons', () => {
    const { queryByText, getByTestId } = render(
      <downloadsContext.Provider value={mockSiteProviderValueMulti}>
        <ResumeDownloadModal />
      </downloadsContext.Provider>
    );
    expect(queryByText(resumeDownloadTitleMulti)).toBeTruthy();
    expect(queryByText(resumeDownloadSubtitleMulti)).toBeTruthy();
    expect(getByTestId('download-items-container').children).toHaveLength(2);
  });
});
