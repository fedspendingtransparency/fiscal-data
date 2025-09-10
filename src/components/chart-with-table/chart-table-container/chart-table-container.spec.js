import React from 'react';
import { render } from '@testing-library/react';
import ChartTableContainer from './chart-table-container';
import userEvent from '@testing-library/user-event';

describe('ChartTableContainer component', () => {
  const mockTitle = 'Test Title';
  const mockAltText = 'Test Alt Text';
  const mockDownloader = <button>Download</button>;
  const mockChildren = <div>Chart Stuff</div>;
  const mockEnabledClickedColorChange = true;

  it('renders the title', () => {
    const { getByText } = render(<ChartTableContainer title={mockTitle} altText={mockAltText} chart={mockChildren} />);
    expect(getByText(mockTitle)).toBeInTheDocument();
  });

  it('renders the chart / table toggle', () => {
    const { getByRole } = render(<ChartTableContainer title={mockTitle} altText={mockAltText} chart={mockChildren} />);
    expect(getByRole('button', { name: 'toggle for chart view' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'toggle for table view' })).toBeInTheDocument();
  });

  it('renders the chart (children)', () => {
    const { getByText } = render(<ChartTableContainer title={mockTitle} altText={mockAltText} chart={mockChildren} />);
    expect(getByText('Chart Stuff')).toBeInTheDocument();
  });

  it('includes an aria-label for accessibility', () => {
    const { getByLabelText } = render(<ChartTableContainer title={mockTitle} altText={mockAltText} chart={mockChildren} />);
    expect(getByLabelText(mockAltText)).toBeInTheDocument();
  });

  it('renders the downloader if provided', () => {
    const { getByText } = render(<ChartTableContainer title={mockTitle} altText={mockAltText} downloader={mockDownloader} chart={mockChildren} />);
    expect(getByText('Download')).toBeInTheDocument();
  });

  it('sets the download click to true if the enabledClickedColor Change prop is passed in as true', () => {
    const { getByTestId, getByText } = render(
      <ChartTableContainer title={mockTitle} altText={mockAltText} chart={mockChildren} enabledClickedColorChange={mockEnabledClickedColorChange} />
    );
    const button = getByText('Download CSV');
    userEvent.click(button);
    const buttonContainer = getByTestId('csvDownloaderContainer');
    expect(buttonContainer).toHaveClass('clickedLabel');
  });
});
