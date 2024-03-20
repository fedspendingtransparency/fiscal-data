import { fireEvent, render } from '@testing-library/react';
import { testSortedGlossaryData } from '../glossary/test-helper';
import React from 'react';
import ScrollContainer from './scroll-container';

describe('Scroll gradient container', () => {
  it('does not apply the gradient when scroll is at the top of the container, and does apply it when scrolled down', () => {
    const { getByTestId } = render(<ScrollContainer list={testSortedGlossaryData} selection={testSortedGlossaryData[0]} />);
    const scrollContainer = getByTestId('scrollContainer');
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 0 } });

    expect(getByTestId('topScrollGradient')).toHaveClass('scrollContainerTop');
    expect(getByTestId('topScrollGradient')).not.toHaveClass('scrollGradientTop');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 20 } });

    expect(getByTestId('topScrollGradient')).not.toHaveClass('scrollContainerTop');
    expect(getByTestId('topScrollGradient')).toHaveClass('scrollGradientTop');
  });

  it('applies a gradient to the bottom when bottom gradient is true, and scroll is not at the bottom of the container', () => {
    const { getByTestId } = render(<ScrollContainer list={testSortedGlossaryData} selection={testSortedGlossaryData[0]} bottomGradient />);
    const scrollContainer = getByTestId('scrollContainer');
    jest.spyOn(scrollContainer, 'scrollHeight', 'get').mockImplementation(() => 150);
    jest.spyOn(scrollContainer, 'clientHeight', 'get').mockImplementation(() => 50);
    fireEvent.scroll(scrollContainer, { target: { scrollTop: 40 } });

    expect(getByTestId('bottomScrollGradient')).not.toHaveClass('scrollContainerBottom');
    expect(getByTestId('bottomScrollGradient')).toHaveClass('scrollGradientBottom');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100 } });

    expect(getByTestId('bottomScrollGradient')).toHaveClass('scrollContainerBottom');
    expect(getByTestId('bottomScrollGradient')).not.toHaveClass('scrollGradientBottom');
  });
});
