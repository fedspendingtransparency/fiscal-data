import React from 'react';
import { render } from '@testing-library/react';
import ExternalLink from './external-link';
import globalConstants from '../../../helpers/constants';
import { RecoilRoot } from 'recoil';

describe('External Link', () => {
  const testUrl = 'https://example.com/';
  const text = 'sample content';
  const content = <div>{text}</div>;

  it('renders an external link with the given url and properties of an external link', () => {
    const { getByTestId, getByText } = render(<ExternalLink url={testUrl}>{content}</ExternalLink>);
    const link = getByTestId('external-link');

    expect(link).toBeInTheDocument();
    expect(getByText(text)).toBeInTheDocument();
    expect(link.href).toBe(testUrl);
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe(globalConstants.EXTERNAL_LINK_REL);
  });

  it('treats .gov URL as a direct link (no modal)', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://www.usaspending.gov/">USAS</ExternalLink>
      </RecoilRoot>
    );
    expect(getByTestId('external-link').getAttribute('href')).toBe('https://www.usaspending.gov/');
  });

  it('applies custom className to anchor element', () => {
    const { getByTestId } = render(
      <RecoilRoot>
        <ExternalLink url="https://example.com/" className="test-class">
          ext
        </ExternalLink>
      </RecoilRoot>
    );
    expect(getByTestId('external-link').classList.contains('test-class')).toBe(true);
  });
});
