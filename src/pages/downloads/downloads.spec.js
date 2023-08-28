import Downloads, { DownloadsPage } from './index';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { from, throwError } from 'rxjs';
import React from 'react';
import globalConstants from '../../helpers/constants';
import downloadService from '../../helpers/download-service/download-service';
import {downloadPageTextContent} from '../../helpers/downloads/download-content-helper';

let mockStatusObservable = from(
  [
    {
      status: "in-progress"
    },
    {
      status: "completed",
      file_path: 'mockDownloadFilePath.zip'
    }
  ]
);

jest.mock('../../helpers/download-service/download-service', function() {
  return {
    __esModule: true,
    default: {
      startPollingByRequestToken: jest.fn().mockImplementation(() => {
        return mockStatusObservable;
      })
    }
  };
});

describe('downloads page', () => {
  let statusPollingSpy
  beforeEach(() => {
    jest.mock('../../helpers/download-service/download-service', function() {
      return {
        __esModule: true,
        default: {
          startPollingByRequestToken: jest.fn().mockImplementation(() => {
            return mockStatusObservable;
          })
        }
      };
    });

    statusPollingSpy = jest.spyOn(downloadService, 'startPollingByRequestToken');
  });

  it('creates successfully', () => {
    const { getByTestId } = render(<Downloads />);

    expect(getByTestId('logo')).toBeDefined();
  });

  it('displays error header and text when  ', () => {
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    const mockToken = '';
    const { getByTestId } = render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}` }} />);

    expect(getByTestId('header')).toHaveTextContent(downloadPageTextContent.dlErrorHeader);
    expect(getByTestId('full-message')).toHaveTextContent(downloadPageTextContent.dlErrorText);
  });

  it('correctly parses the token out of its url, starts polling, and downloads when status is completed', () => {
    const locationMock = jest.fn();
    delete window.location;
    window.location = { assign: locationMock };

    const mockToken = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}` }} />);
    expect(statusPollingSpy).toHaveBeenCalledWith(mockToken);
    expect(locationMock).toHaveBeenCalledWith(`${globalConstants.DATA_DOWNLOAD_STATUS_PREFIX}/mockDownloadFilePath.zip`);
  });

  it('displays error messages when fetch errors', () => {
    mockStatusObservable = throwError(() => new Error('Error!!') );
    jest.clearAllMocks();
    const mockToken = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const { getByTestId } = render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}`}} /> )

    expect(getByTestId('header')).toHaveTextContent(downloadPageTextContent.dlErrorHeader);
    expect(getByTestId('full-message')).toHaveTextContent(downloadPageTextContent.dlErrorText);
  });

  it('displays proper messages when download is not yet complete', () => {
    mockStatusObservable = from([{ status: 'started' }]);
    jest.clearAllMocks();
    const mockToken = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const { getByTestId } = render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}`}} /> )
    expect(getByTestId('header')).toHaveTextContent(downloadPageTextContent.dlBeingPreparedHeader);
    expect(getByTestId('full-message')).toHaveTextContent(downloadPageTextContent.dlBeingPreparedText);
  });

  it('displays proper messages when download is not yet complete', () => {
    mockStatusObservable = from([{ status: 'completed', filePath: 'test-file-path.csv' }]);
    jest.clearAllMocks();
    const mockToken = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const { getByTestId } = render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}`}} /> )
    expect(getByTestId('header')).toHaveTextContent(downloadPageTextContent.dlReadyHeader);
    expect(getByTestId('full-message')).toHaveTextContent(downloadPageTextContent.dlReadyText);
  });
  it('displays proper messages when download has failed', () => {
    mockStatusObservable = from([{ status: 'failed', filePath: 'test-file-path.csv', statusPath: "status.json", filesize_kb: 123.45 }]);
    jest.clearAllMocks();
    const mockToken = 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
    const { getByTestId } = render(<DownloadsPage location={{ pathname: `/downloads/${mockToken}`}} /> )
    expect(getByTestId('header')).toHaveTextContent(downloadPageTextContent.dlErrorHeader);
    expect(getByTestId('full-message')).toHaveTextContent(downloadPageTextContent.dlErrorText);
  });
});
