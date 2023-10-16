import React from 'react';
import DocumentationLinkSection from './documentation-link-section';
import { render } from '@testing-library/react';

describe('Documentation Link Section', () => {
  it('renders the header if the "type" prop is not set', () => {
    const { getByTestId } = render(<DocumentationLinkSection />);
    const headerSection = getByTestId('header');
    expect(headerSection).toBeInTheDocument();
  });

  it('renders the footer section as expected', () => {
    const { getByTestId } = render(<DocumentationLinkSection type={'footer'} />);
    const leftFooterSection = getByTestId('footer');
    expect(leftFooterSection).toBeInTheDocument();
  });

  it('renders a link to the API Documentation page', () => {
    const { getByTestId } = render(<DocumentationLinkSection />);
    const button = getByTestId('button-link');
    expect(button).toBeInTheDocument();
    expect(button.outerHTML).toContain('/api-documentation/');
  });
});
