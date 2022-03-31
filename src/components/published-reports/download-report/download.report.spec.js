import renderer from 'react-test-renderer';
import { reports } from '../test-helper';
import React from 'react';
import DownloadReport from './download-report';
import DownloadItemButton from '../../download-wrapper/download-item-button/download-item-button';
import fetchMock from "jest-fetch-mock";
import {enableFetchMocks} from 'jest-fetch-mock';
import * as helpers from './download-helpers';
import { render } from '@testing-library/react';
jest.useFakeTimers();

describe('Download Report Component', () => {
  enableFetchMocks();
  let component, instance;
  const getFileSizeSpy = jest.spyOn(helpers, 'getFileSize');

  fetchMock.mockResponse(
    'body',
    {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Length': 2097152
      }
    }
  );

  beforeEach(() => {
    component = renderer.create(
      <DownloadReport reportFile={reports[0]} />
    );

    instance = component.root;
  });

  afterEach(() => {
    getFileSizeSpy.mockClear();
  });

  it('displays the proper group name', () => {
    const { getByText } = render(<DownloadReport reportFile={reports[0]} />)
    expect(getByText('Entire (.pdf)')).toBeInTheDocument();
  });

  it(`when no report file is supplied, displays "N/A" for file date, includes help text,
  sets the download button to disabled and does not call getFileSize`, () => {
    getFileSizeSpy.mockClear();
    renderer.act(() => {
      component = renderer.create(<DownloadReport />);
    });
    instance = component.root;
    expect(instance.findByProps({ 'data-testid': 'reportFileDate' }).children).toEqual(['N/A']);
    expect(instance.findByProps({ 'data-testid': 'helpText' }).children)
      .toEqual(['Please select a report to download']);
    expect(instance.findByType(DownloadItemButton).props.disabled).toBeTruthy();
    expect(getFileSizeSpy).not.toHaveBeenCalled();
  });

  it(`displays the correct filename and passes the correct attributes to the button when a
  report file is supplied`, () => {

    jest.runAllTimers();
    const downloadButton = instance.findByType(DownloadItemButton);
    expect(downloadButton.props.href).toEqual(reports[0].path);
    expect(downloadButton.props.download).toEqual('opdm072020.pdf');
    expect(downloadButton.props.disabled).toBeFalsy();

    expect(instance.findByProps({ 'data-testid': 'reportFileDate' }).children)
      .toEqual(['Jul 2020']);
    expect(instance.findByProps({ 'data-testid': 'helpText' }).children)
      .toEqual([]);
    expect(getFileSizeSpy).toHaveBeenCalled();
  });
});
