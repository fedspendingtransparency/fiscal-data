import DownloadItemButton, { downloadFileEventStr } from './download-item-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import React from 'react';
import Analytics from '../../../utils/analytics/analytics';

import { render, within } from '@testing-library/react';
import { smallTableDownloadData } from '../../../recoil/smallTableDownloadData';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
describe('DownloadItemButton for static file', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} size="1x" />;
  const hrefStr = 'dummyHref';
  const downloadStr = 'dummyDownload';

  it('renders an anchor tag', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    expect(anchor).toBeDefined();
  });
  it('sets the href as provided', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    expect(anchor).toHaveAttribute('href', hrefStr);
  });
  it('sets the download prop as provided', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    expect(anchor).toHaveAttribute('download', downloadStr);
  });

  it('sets the icon as provided', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    const icon = within(anchor).getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fa-table');
  });
  it('sets the label as provided', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    expect(within(anchor).getByText('CSV')).toBeInTheDocument();
  });
  it('sets the fileSize as provided', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </>
    );
    const anchor = getByRole('link');
    expect(within(anchor).getByText('(200B)')).toBeInTheDocument();
  });
});

describe('DownloadItemButton for direct download file', () => {
  global.structuredClone = val => JSON.parse(JSON.stringify(val));
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const mockedCSVState = [
    ['Apple', 'Banana'],
    [1, 2],
    [3, 4],
  ];
  const mockedJSONState = 'JSON String';
  const mockedXMLState = 'XML String';
  afterEach(() => {
    smallTableDownloadData.setState({ csv: [], json: '', xml: {}, tableRowLength: null });
  });

  it('direct CSV download', () => {
    smallTableDownloadData.setState({ csv: mockedCSVState });
    const { getByTestId } = render(
      <>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} selectedFileType="csv" />
      </>
    );
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
  });

  it('direct CSV download with timestamp', async () => {
    smallTableDownloadData.setState({ csv: mockedCSVState });
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const { getByTestId } = render(
      <>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} selectedFileType="csv" downloadTimestamp={true} />
      </>
    );
    expect(getByTestId('csv-timestamp-download-button')).toBeInTheDocument();
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
    await user.click(getByTestId('csv-timestamp-download-button'));
  });

  it('direct XML download', () => {
    smallTableDownloadData.setState({ xml: mockedXMLState });
    const { getByTestId } = render(
      <>
        <DownloadItemButton label="XML" fileSize="123MB" icon={csvIcon} selectedFileType="xml" />
      </>
    );

    expect(getByTestId('xml-download-button')).toBeInTheDocument();
  });
  it('disables XML download when a pivot is selected', () => {
    smallTableDownloadData.setState({ xml: mockedXMLState });
    const { getByRole } = render(
      <>
        <DownloadItemButton label="XML" fileSize="123MB" icon={csvIcon} selectedFileType="xml" selectedPivot={{ pivotValue: 'something' }} />
      </>
    );

    expect(getByRole('button', { name: 'XML (123MB)' })).toBeDisabled();
  });

  it('direct JSON download', () => {
    smallTableDownloadData.setState({ json: mockedJSONState });
    const { getByTestId } = render(
      <>
        <DownloadItemButton label="JSON" fileSize="123MB" icon={csvIcon} selectedFileType="json" />
      </>
    );
    expect(getByTestId('json-download-button')).toBeInTheDocument();
  });
});

describe('DownloadItemButton for asyncAction', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const asyncActionMock = jest.fn();
  it('sets the label and fileSize as provided', () => {
    const { getByText } = render(
      <>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} />
      </>
    );

    expect(getByText('CSV')).toBeInTheDocument();
    expect(getByText('(123MB)')).toBeInTheDocument();
  });

  it('calls the asyncAction provided when clicked', () => {
    const { getByRole } = render(
      <>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} asyncAction={asyncActionMock} />
      </>
    );
    jest.runAllTimers();
    const button = getByRole('button');
    button.click();
    expect(asyncActionMock).toHaveBeenCalled();
  });

  it('tracks when a published report downloads is clicked', () => {
    const { getByTestId } = render(
      <>
        <DownloadItemButton download="fileName" />
      </>
    );

    const spy = jest.spyOn(Analytics, 'event');

    const thisLink = getByTestId('download-button');

    thisLink.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ action: 'Published Report Download', label: 'fileName', category: 'Data Download' });
  });

  it('tracks when a dataset file is downloaded', () => {
    const { getByTestId } = render(
      <>
        <DownloadItemButton dapGaEventLabel="test" />
      </>
    );

    const spy = jest.spyOn(Analytics, 'event');
    spy.mockClear();
    const thisLink = getByTestId('download-button');

    thisLink.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ action: downloadFileEventStr, label: 'test' }));
  });

  it('shows a a download link when the disabled prop is not passed in', () => {
    const { getByTestId } = render(
      <>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} />
      </>
    );

    const thisLink = getByTestId('download-button');

    expect(thisLink).not.toBeDisabled();
  });

  it('shows a disabled button when the disabled prop is passed in', () => {
    const { getByTestId } = render(
      <>
        <DownloadItemButton disabled />
      </>
    );
    const thisLink = getByTestId('download-button');

    expect(thisLink).toBeDisabled();
  });
});
