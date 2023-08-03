import { fireEvent, render } from '@testing-library/react';
import { testSortedGlossaryData } from '../glossary/test-helper';
import React from 'react';
import ScrollContainer from './scroll-container';


describe('Scroll gradient container', () => {

  it('applies a gradient to the scroll container when it is not at the top', () => {
    const setScrollTopSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollContainer list={testSortedGlossaryData}
                               selection={testSortedGlossaryData[0]}
                               scrollTop={false}
                               setScrollTop={setScrollTopSpy}
      >
      </ScrollContainer>
    );
    const scrollContainer = getByTestId('scrollContainer');

    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollContainerTop');
    expect(getByTestId('scrollGradient')).toHaveClass('scrollGradient');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 0}});

    expect(setScrollTopSpy).toHaveBeenCalledWith(true);
  })

  it('does not apply a gradient to the scroll container when it is at the top', () => {
    const setScrollTopSpy = jest.fn();
    const { getByTestId } = render(
      <ScrollContainer list={testSortedGlossaryData}
                               selection={testSortedGlossaryData[0]}
                               scrollTop={true}
                               setScrollTop={setScrollTopSpy}
      >
      </ScrollContainer>
    );
    const scrollContainer = getByTestId('scrollContainer');

    expect(getByTestId('scrollGradient')).toHaveClass('scrollContainerTop');
    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollGradient');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100}});

    expect(setScrollTopSpy).toHaveBeenCalledWith(false);
  })
})
