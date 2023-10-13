import React from 'react';
import { render } from '@testing-library/react';
import ExternalLink from './external-link';
import globalConstants from '../../../helpers/constants';

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
});
