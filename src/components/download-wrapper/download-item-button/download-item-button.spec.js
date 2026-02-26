import DownloadItemButton, { downloadFileEventStr } from './download-item-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import React from 'react';
import Analytics from '../../../utils/analytics/analytics';
import { RecoilRoot } from 'recoil';
import { render, within } from '@testing-library/react';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';
import userEvent from '@testing-library/user-event';

jest.useFakeTimers();
describe('DownloadItemButton for static file', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} size="1x" />;
  const hrefStr = 'dummyHref';
  const downloadStr = 'dummyDownload';

  it('renders an anchor tag', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
    const anchor = getByRole('link');
    expect(anchor).toBeDefined();
  });
  it('sets the href as provided', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
    const anchor = getByRole('link');
    expect(anchor).toHaveAttribute('href', hrefStr);
  });
  it('sets the download prop as provided', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
    const anchor = getByRole('link');
    expect(anchor).toHaveAttribute('download', downloadStr);
  });

  it('sets the icon as provided', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
    const anchor = getByRole('link');
    const icon = within(anchor).getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('fa-table');
  });
  it('sets the label as provided', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
    const anchor = getByRole('link');
    expect(within(anchor).getByText('CSV')).toBeInTheDocument();
  });
  it('sets the fileSize as provided', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
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

  it('direct CSV download', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataCSV, mockedCSVState)}>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} selectedFileType="csv" />
      </RecoilRoot>
    );
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
  });

  it('direct CSV download with timestamp', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataCSV, mockedCSVState)}>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} selectedFileType="csv" downloadTimestamp={true} />
      </RecoilRoot>
    );
    expect(getByTestId('csv-timestamp-download-button')).toBeInTheDocument();
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
    userEvent.click(getByTestId('csv-timestamp-download-button'));
  });

  it('direct XML download', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataXML, mockedXMLState)}>
        <DownloadItemButton label="XML" fileSize="123MB" icon={csvIcon} selectedFileType="xml" />
      </RecoilRoot>
    );

    expect(getByTestId('xml-download-button')).toBeInTheDocument();
  });
  it('disables XML download when a pivot is selected', () => {
    const { getByRole } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataXML, mockedXMLState)}>
        <DownloadItemButton label="XML" fileSize="123MB" icon={csvIcon} selectedFileType="xml" selectedPivot={{ pivotValue: 'something' }} />
      </RecoilRoot>
    );

    expect(getByRole('button', { name: 'XML (123MB)' })).toBeDisabled();
  });

  it('direct JSON download', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataJSON, mockedJSONState)}>
        <DownloadItemButton label="JSON" fileSize="123MB" icon={csvIcon} selectedFileType="json" />
      </RecoilRoot>
    );
    expect(getByTestId('json-download-button')).toBeInTheDocument();
  });
});

describe('DownloadItemButton for asyncAction', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const asyncActionMock = jest.fn();
  it('sets the label and fileSize as provided', () => {
    const { getByText } = render(
      <RecoilRoot>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} />
      </RecoilRoot>
    );

    expect(getByText('CSV')).toBeInTheDocument();
    expect(getByText('(123MB)')).toBeInTheDocument();
  });

  it('calls the asyncAction provided when clicked', () => {
    const { getByRole } = render(
      <RecoilRoot>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} asyncAction={asyncActionMock} />
      </RecoilRoot>
    );
    jest.runAllTimers();
    const button = getByRole('button');
    button.click();
    expect(asyncActionMock).toHaveBeenCalled();
  });

  it('tracks when a published report downloads is clicked', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadItemButton download="fileName" />
      </RecoilRoot>
    );

    const spy = jest.spyOn(Analytics, 'event');

    const thisLink = getByTestId('download-button');

    thisLink.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ action: 'Published Report Download', label: 'fileName', category: 'Data Download' });
  });

  it('tracks when a dataset file is downloaded', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadItemButton dapGaEventLabel="test" />
      </RecoilRoot>
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
      <RecoilRoot>
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} />
      </RecoilRoot>
    );

    const thisLink = getByTestId('download-button');

    expect(thisLink).not.toBeDisabled();
  });

  it('shows a disabled button when the disabled prop is passed in', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadItemButton disabled />
      </RecoilRoot>
    );
    const thisLink = getByTestId('download-button');

    expect(thisLink).toBeDisabled();
  });
});
