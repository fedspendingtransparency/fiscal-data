import renderer from 'react-test-renderer';
import DownloadItemButton, { downloadFileEventStr } from './download-item-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { optionIcon } from './download-item-button.module.scss';
import Analytics from '../../../utils/analytics/analytics';
import { RecoilRoot } from 'recoil';
import { render } from '@testing-library/react';
import { smallTableDownloadDataCSV, smallTableDownloadDataJSON, smallTableDownloadDataXML } from '../../../recoil/smallTableDownloadData';

jest.useFakeTimers();
describe('DownloadItemButton for static file', () => {
  const csvIcon = <FontAwesomeIcon icon={faTable} data-test-id="table-icon" size="1x" />;
  const hrefStr = 'dummyHref';
  const downloadStr = 'dummyDownload';
  let component = {};
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DownloadItemButton fileSize="200B" icon={csvIcon} label="CSV" href={hrefStr} download={downloadStr} />
      </RecoilRoot>
    );
  });
  const instance = component.root;
  const anchor = instance.findByType('a');

  it('renders an anchor tag', () => {
    expect(anchor).toBeDefined();
  });
  it('sets the href as provided', () => {
    expect(anchor.props.href).toBe(hrefStr);
  });
  it('sets the download prop as provided', () => {
    expect(anchor.props.download).toBe(downloadStr);
  });
  it('sets the icon as provided', () => {
    expect(anchor.findByProps({ className: optionIcon }).findByProps({ 'data-test-id': 'table-icon' })).toBeDefined();
  });
  it('sets the label as provided', () => {
    expect(
      anchor
        .findByProps({ className: 'labelText' })
        .props.children.join('')
        .trim()
    ).toEqual('CSV');
  });
  it('sets the fileSize as provided', () => {
    expect(
      anchor
        .findByProps({ className: 'fileSize' })
        .props.children.join('')
        .trim()
    ).toEqual('(200B)');
  });
});

describe('DownloadItemButton for direct download file', () => {
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
        <DownloadItemButton label="CSV" fileSize="123MB" icon={csvIcon} directCSVDownload />
      </RecoilRoot>
    );
    expect(getByTestId('csv-download-button')).toBeInTheDocument();
  });

  it('direct XML download', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataXML, mockedXMLState)}>
        <DownloadItemButton label="XML" fileSize="123MB" icon={csvIcon} directXMLDownload />
      </RecoilRoot>
    );

    expect(getByTestId('xml-download-button')).toBeInTheDocument();
  });

  it('direct JSON download', () => {
    const { getByTestId } = render(
      <RecoilRoot initializeState={snapshot => snapshot.set(smallTableDownloadDataJSON, mockedJSONState)}>
        <DownloadItemButton label="JSON" fileSize="123MB" icon={csvIcon} directJSONDownload />
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
    expect(spy).toHaveBeenCalledWith({ action: 'fileName', category: 'Data Download' });
  });

  it('tracks when a dataset file is downloaded', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <DownloadItemButton />
      </RecoilRoot>
    );

    const spy = jest.spyOn(Analytics, 'event');
    spy.mockClear();
    const thisLink = getByTestId('download-button');

    thisLink.click();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ label: downloadFileEventStr }));
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
