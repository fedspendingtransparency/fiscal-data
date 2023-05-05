import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import GlossaryList from './glossary-list';
import { glossaryMapExample } from '../test-helper';
describe('glossary list',() => {
  it('contains the initial list header', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryMapExample} />);

    expect(getByText('All Terms')).toBeInTheDocument();
  });

  it('renders a header for every letter containing a term', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryMapExample} />);

    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('P')).toBeInTheDocument();
  });

  it('renders all terms for each given letter', () => {
    const { getByText } = render(<GlossaryList termMap={glossaryMapExample} />);

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Another Apple')).toBeInTheDocument();
    expect(getByText('Banana')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
  });

  it('applies a gradient to the scroll container when it is not at the top', () => {
    const { getByTestId } = render(
        <GlossaryList termMap={glossaryMapExample} />
    );

    expect(getByTestId('scrollGradient')).toHaveClass('scrollContainerTop');

    const scrollContainer = getByTestId('scrollContainer');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100}})
    expect(getByTestId('scrollGradient')).toHaveClass('scrollGradient');
    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollContainerTop');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 0}})
    expect(getByTestId('scrollGradient')).toHaveClass('scrollContainerTop');
    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollGradient');
  })

});
