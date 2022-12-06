import React from 'react';
import {render, waitFor} from '@testing-library/react'
import InsightsDownload from "./insights-download";
import {fireEvent} from "@testing-library/dom";


describe('Insights Download', () => {

  global.URL.createObjectURL = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      value: 'value',
      blob: () => 'hi'
    }));
  });

  it('renders the downloader and text', () => {
    const { getByTestId, getByText } = render(<InsightsDownload downloadLink={'sampleLink'} dataDate={'Dec 2022'} />);
    expect(getByTestId('insights-download')).toBeInTheDocument();
    expect(getByTestId('download-button')).toBeInTheDocument();
    expect(getByText('Download the data (.csv) as of Dec 2022')).toBeDefined();
  });

  it('downloads the file', async() => {
    const fetchSpy = jest.spyOn(global, "fetch");
    const { getByTestId } = render(<InsightsDownload downloadLink={'sampleLink'} dataDate={'Dec 2022'} />);
    fireEvent.click(getByTestId('download-button'));
    await waitFor(() => expect(fetchSpy).toBeCalled());
  });

});
