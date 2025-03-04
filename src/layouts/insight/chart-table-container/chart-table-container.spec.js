import React from 'react';
import { render } from '@testing-library/react';
import { ChartTableContainer } from './chart-table-container';

describe('ChartTableContainer component', () => {
  const mockTitle = 'Test Title';
  const mockFooter = <div>Test Footer</div>;
  const mockHeader = <div>Test Header</div>;
  const mockAltText = 'Test Alt Text';
  const mockDownloader = <button>Download</button>;
  const mockChildren = <div>Chart Stuff</div>;

  it('renders the title', () => {
    const { getByText } = render(
      <ChartTableContainer title={mockTitle} altText={mockAltText}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByText(mockTitle)).toBeInTheDocument();
  });

  it('renders the footer', () => {
    const { getByText } = render(
      <ChartTableContainer title={mockTitle} footer={mockFooter} altText={mockAltText}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByText('Test Footer')).toBeInTheDocument();
  });

  it('renders the header', () => {
    const { getByText } = render(
      <ChartTableContainer title={mockTitle} header={mockHeader} altText={mockAltText}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByText('Test Header')).toBeInTheDocument();
  });

  it('renders the chart (children)', () => {
    const { getByText } = render(
      <ChartTableContainer title={mockTitle} altText={mockAltText}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByText('Chart Stuff')).toBeInTheDocument();
  });

  it('includes an aria-label for accessibility', () => {
    const { getByLabelText } = render(
      <ChartTableContainer title={mockTitle} altText={mockAltText}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByLabelText(mockAltText)).toBeInTheDocument();
  });

  it('renders the downloader if provided', () => {
    const { getByText } = render(
      <ChartTableContainer title={mockTitle} altText={mockAltText} downloader={mockDownloader}>
        {mockChildren}
      </ChartTableContainer>
    );
    expect(getByText('Download')).toBeInTheDocument();
  });
});
