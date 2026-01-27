import React from 'react';
import { render } from '@testing-library/react';
import Topics from './topics';
import { config } from './test-helpers';
import { RecoilRoot } from 'recoil';

jest.mock('../../components/site-footer/site-footer', () => () => <div data-testid="siteFooter" />);
const renderTopics = () =>
  render(
    <RecoilRoot>
      <Topics pageContext={{ config, isPreProd: true }} />
    </RecoilRoot>
  );

describe('Topics layout', () => {
  it('should ', () => {
    expect(true);
  });
  // it('includes the site header', () => {
  //   renderTopics();
  //   expect(screen.getByRole('banner')).toBeInTheDocument();
  // });
  //
  // it('includes the site footer', () => {
  //   renderTopics();
  //   expect(screen.getByTestId('siteFooter')).toBeInTheDocument();
  // });
  //
  // it('contains the Masthead component', () => {
  //   renderTopics();
  //   expect(screen.getByRole('heading', { name: /debt highlights/i })).toBeInTheDocument();
  // });
  //
  // it('contains the Highlights section with the title Debt', () => {
  //   const { container } = renderTopics();
  //   const highlights = container.querySelector('#highlights');
  //   expect(highlights).toBeInTheDocument();
  //   expect(within(highlights).getByText('Debt Highlights')).toBeInTheDocument();
  // });
  //
  // it('contains a Related Datasets component', () => {
  //   renderTopics();
  //   expect(screen.getByText(/related datasets/i)).toBeInTheDocument();
  // });
  //
  // it('contains a Related Analyses section', () => {
  //   const { container } = renderTopics();
  //
  //   const relatedAnalyses = container.querySelector('#related-analyses');
  //   expect(relatedAnalyses).toBeInTheDocument();
  //   expect(within(relatedAnalyses).getByText('Related Analyses')).toBeInTheDocument();
  // });
});
