import { act, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { testGlossaryData, testSortedGlossaryData } from '../test-helper';
import userEvent from '@testing-library/user-event';
import GlossaryListContainer from './glossary-list-container';
describe('glossary list container',() => {
  it('contains the initial list header', () => {
    const { getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
    );

    expect(getByText('All Terms')).toBeInTheDocument();
  });

  it('applies a gradient to the scroll container when it is not at the top', () => {
    const { getByTestId } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
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

  it('opens a terms definition display on click', () => {
    const { getByRole, getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
    );

    const termButton = getByRole('button', {name: 'Apple'});
    termButton.click();

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();

  })

  it('definition display is keyboard accessible', () => {
    const { getByRole, getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
    );

    const termButton = getByRole('button', {name: 'Another Apple'});

    act(() => {
      userEvent.tab();
    })
    expect(termButton).toHaveFocus();
    act(() => {
      userEvent.keyboard('[enter]');
    });
    expect(getByText('Another Apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();
  })

  it('renders the back to list button when a definition is displayed', () => {
    const { getByText, getByRole } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
    );

    const termButton = getByText('Banana');
    termButton.click();

    const backButton = getByRole('button', {name: 'Back to list'});
    backButton.click();
  })

  it('renders the back to list button when the list is filtered', () => {
    const { getByText, getByRole, queryByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={'Apple'} filterHandler={jest.fn()} />
    );
    const backButton = getByRole('button', {name: 'Back to list'});

    expect(queryByText('All Terms')).toBeFalsy();
    expect(backButton).toBeInTheDocument();

    backButton.click();

    expect(getByText('All Terms')).toBeInTheDocument();
  })

  it('renders the back to list button when the no match found message is displayed', () => {
    const { getByText, getByRole, queryByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={'orange'} filterHandler={jest.fn()} />
    );

    const backButton = getByRole('button', {name: 'Back to list'});

    expect(queryByText('All Terms')).toBeFalsy();
    expect(backButton).toBeInTheDocument();

    backButton.click();

    expect(getByText('All Terms')).toBeInTheDocument();
  })

  it('initially displays the default term definition when a default term is provided', () => {
    const defaultTerm = testGlossaryData[0];
    const { getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} defaultTerm={defaultTerm} filter={''} filterHandler={jest.fn()} />
    );

    const {term, definition} = defaultTerm;


    expect(getByText(term)).toBeInTheDocument();
    expect(getByText(definition)).toBeInTheDocument();
  })

  it('filters terms and their headers with the provided a search filter', () => {
    const { getByText, queryByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={'Pear'} filterHandler={jest.fn()} />
    );

    expect(getByText('P')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
    expect(queryByText('A')).not.toBeInTheDocument();
    expect(queryByText('Apple')).not.toBeInTheDocument();
    expect(queryByText('All Terms')).not.toBeInTheDocument();
  })

  it('displays the full term list when the search filter is empty', () => {
    const { getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={''} filterHandler={jest.fn()} />
    );

    expect(getByText('All Terms')).toBeInTheDocument();
  })

  it('displays the no match found message when the search filter does not match any terms', () => {
    const { getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={'orange'} filterHandler={jest.fn()} />
    );

    expect(getByText('No match found for')).toBeInTheDocument();
    expect(getByText('\'orange.\'')).toBeInTheDocument();
  });

  it('ignores case from the search filter', () => {
    const { getByText } = render(
      <GlossaryListContainer sortedTermList={testSortedGlossaryData} filter={'pEAr'} filterHandler={jest.fn()} />
    );

    expect(getByText('P')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
  });

});
