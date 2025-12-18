import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitationList from './citation-list';
import { analyticsEventHandler } from '../../helpers/insights/insight-helpers';

jest.mock('../../helpers/insights/insight-helpers', () => ({
  analyticsEventHandler: jest.fn(),
}));

describe('Citation List', () => {
  const mockHeader = 'Mock Header';
  const mockPageName = 'Test Page';

  const mockCitations = [
    {
      url: 'https://www.federalreserve.gov/',
      text: 'External Resource',
      external: true,
    },
    {
      url: 'https://fiscaldata.treasury.gov/about-us/',
      text: 'Second Citation',
      external: false,
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header with the default heading level (h2)', () => {
    render(<CitationList header={mockHeader} citations={[]} />);

    expect(screen.getByRole('heading', { level: 2, name: mockHeader })).toBeInTheDocument();
  });

  it('renders the header with a custom heading level', () => {
    render(<CitationList header={mockHeader} citations={[]} headingLevel="h4" />);
    expect(screen.getByRole('heading', { level: 4, name: mockHeader })).toBeInTheDocument();
  });

  it('renders external citations with the correct icon and text formatting', () => {
    render(<CitationList header={mockHeader} citations={[mockCitations[0]]} />);

    const link = screen.getByRole('link', { name: 'External Resource' });
    expect(link).toHaveAttribute('href', 'https://www.federalreserve.gov/');
  });

  it('renders internal citations with the appended text and link icon', () => {
    render(<CitationList header={mockHeader} citations={[mockCitations[1]]} />);

    const link = screen.getByRole('link', { name: 'Second Citation | U.S. Treasury Fiscal Data' });
    expect(link).toBeInTheDocument();

    expect(link.querySelector('svg[data-icon="link"]')).toBeInTheDocument();
  });

  it('calls the analytics event handler with the correct pageName and text on click', () => {
    render(<CitationList header={mockHeader} citations={[mockCitations[1]]} pageName={mockPageName} />);

    const link = screen.getByRole('link');

    userEvent.click(link);

    expect(analyticsEventHandler).toHaveBeenCalledTimes(1);
    expect(analyticsEventHandler).toHaveBeenCalledWith(mockPageName, mockCitations[1].text);
  });
});
