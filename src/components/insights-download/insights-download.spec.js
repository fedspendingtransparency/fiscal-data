import React from 'react';
import { render } from '@testing-library/react';
import InsightsDownload from './insights-download';

describe('Insights Download', () => {
  it('renders the downloader and text', () => {
    const { getByTestId, getByText } = render(<InsightsDownload downloadLink={'sampleLink'} dataDate={'Dec 2022'} />);
    expect(getByTestId('insights-download')).toBeInTheDocument();
    expect(getByTestId('download-button')).toBeInTheDocument();
    expect(getByText('Download the data (.CSV) as of Dec 2022')).toBeDefined();
  });
});
