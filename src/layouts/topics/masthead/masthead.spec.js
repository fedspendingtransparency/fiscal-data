import React from 'react';
import MastHead from './masthead';
import { render, within } from '@testing-library/react';

describe('Topics Masthead', () => {
  const title = 'Dummy Topic';

  it('contains the topic title within its breadcrumbs', () => {
    const { getByTestId } = render(<MastHead title={title} />);
    const breadCrumbs = getByTestId('breadcrumbs');
    expect(within(breadCrumbs).getByText(title)).toBeInTheDocument();
  });

  it('displays the topic title within its header element', () => {
    const { getByRole } = render(<MastHead title={title} />);
    const header = getByRole('heading', { name: title, level: 1 });
    expect(header).toBeInTheDocument();
  });

  it('contains a tagLine', () => {
    const { getByTestId } = render(<MastHead title={title} />);

    expect(getByTestId('tagLine')).toBeInTheDocument();
  });

  it('contains a Related Topics section', () => {
    const { getByTestId } = render(<MastHead title={title} />);

    expect(getByTestId('relatedTopics')).toBeInTheDocument();
  });
});
