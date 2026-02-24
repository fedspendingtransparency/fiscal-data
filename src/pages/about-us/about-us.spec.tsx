import React from 'react';
import { render } from '@testing-library/react';
import AboutUsPage from './index';
import tocData from './toc-data.json';
import { RecoilRoot } from 'recoil';
import { Head } from './index';

describe('About Us page', () => {
  it('renders a table of contents with correct content', () => {
    const { getAllByText } = render(<AboutUsPage />, { wrapper: RecoilRoot });

    tocData.forEach(item => {
      expect(getAllByText(item.title)[0]).toBeInTheDocument();
    });
  });

  it('renders the About section component', () => {
    const { container } = render(<AboutUsPage />, { wrapper: RecoilRoot });
    expect(container.querySelector('#about-fiscal-data')).toBeInTheDocument();
  });

  it('renders the FAQ section component', () => {
    const { container } = render(<AboutUsPage />, { wrapper: RecoilRoot });
    expect(container.querySelector('#faq')).toBeInTheDocument();
  });

  it('renders the Contact section component', () => {
    const { container } = render(<AboutUsPage />, { wrapper: RecoilRoot });
    expect(container.querySelector('#contact-us')).toBeInTheDocument();
  });

  it('ensures component has the correct page helmet title', () => {
    render(<Head />);
    expect(document.title).toBe('About Us | U.S. Treasury Fiscal Data');
  });
});
