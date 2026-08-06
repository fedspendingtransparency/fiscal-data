import React from 'react';
import { render } from '@testing-library/react';
import CustomLink from './custom-link';

describe('Custom Link', () => {
  const externalUrl = 'https://example.com/';
  const text = 'sample content';
  const content = <div>{text}</div>;

  it('renders an internal link when the url does not start with "http(s)"', () => {
    const { getByTestId, getByText, queryByTestId } = render(<CustomLink url="/">{content}</CustomLink>);
    expect(getByTestId('internal-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(queryByTestId('external-link')).not.toBeInTheDocument();
  });

  it('renders an external link when the url starts with "http(s)"', () => {
    const { getByTestId, getByText, queryByTestId } = render(<CustomLink url={externalUrl}>{content}</CustomLink>);
    expect(getByTestId('external-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(queryByTestId('internal-link')).not.toBeInTheDocument();
  });

  it('renders an external link when the external prop is passed in"', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <CustomLink url="/" external>
        {content}
      </CustomLink>
    );
    expect(getByTestId('external-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(queryByTestId('internal-link')).not.toBeInTheDocument();
  });

  it('renders an external link when the url is prefixed with "external:"', () => {
    const { getByTestId, getByText, queryByTestId } = render(<CustomLink url="external:/">{content}</CustomLink>);
    expect(getByTestId('external-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(queryByTestId('internal-link')).not.toBeInTheDocument();
  });

  it('renders a scroll link when the url is prefixed with "#"', () => {
    const { getByTestId, getByText } = render(<CustomLink url="#dummyLink">{content}</CustomLink>);
    expect(getByTestId('scroll-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
  });

  it('renders a download anchor tag if the href ends with .pdf', () => {
    const { getByTestId, getByText } = render(<CustomLink url="/data/dummyFile.pdf">{content}</CustomLink>);
    expect(getByTestId('download-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
  });

  it('does not render a javascript: url as a clickable link', () => {
    const { container } = render(<CustomLink url="javascript:alert(1)//x.pdf">{content}</CustomLink>);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href') || '').not.toContain('javascript');
  });

  it('does not render a data: url as a clickable link', () => {
    const { container } = render(<CustomLink url="data::text/html,<script>alert(1)</script>">{content}</CustomLink>);
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href') || '').not.toContain('data');
  });

  it('treats protocol-relative url as external rather than a same-site download', () => {
    const { getByTestId, queryByTestId } = render(<CustomLink url="//evil/tld/payload.pdf">{content}</CustomLink>);
    expect(queryByTestId('download-link')).not.toBeInTheDocument();
    expect(getByTestId('external-link')).toBeInTheDocument();
  });

  it('renders an internal link when the absolute URL is on the fiscaldata.treasury.gov domain', () => {
    const fiscalDataUrl = 'https://fiscaldata.treasury.gov/datasets/daily-government-account-series/held-by-the-public-daily-activity';

    const { getByTestId, getByText, queryByTestId } = render(<CustomLink url={fiscalDataUrl}>{content}</CustomLink>);

    expect(getByTestId('internal-link')).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(queryByTestId('external-link')).not.toBeInTheDocument();
  });
});
