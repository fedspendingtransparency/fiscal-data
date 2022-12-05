import React from 'react';
import { render } from '@testing-library/react'
import InsightsDownload from "./insights-download";
import {fireEvent} from "@testing-library/dom";


describe('Insights Download', () => {

  it('renders the downloader and text', () => {
    const { getByTestId, getByText } = render(<InsightsDownload downloadLink={'sampleLink'} dataDate={'Dec 2022'} />);
    expect(getByTestId('insights-download')).toBeInTheDocument();
    expect(getByTestId('download-button')).toBeInTheDocument();
    expect(getByText('Download the data (.csv) as of Dec 2022')).toBeDefined();
  });

  it('downloads the file', () => {
    jest.mock('./insights-download', () => ({getFile: jest.fn()}))
    const { getByTestId } = render(<InsightsDownload downloadLink={'/sample-file.csv'} dataDate={'Dec 2022'} />);
    fireEvent.click(getByTestId('download-button'));
  });

});
