import { act, fireEvent, getAllByText, render } from '@testing-library/react';
import React from 'react';
import GlossaryList from './glossary-list';
import { glossaryMapExample, testGlossaryData, testGlossaryData2 } from '../test-helper';
import userEvent from '@testing-library/user-event';
describe('glossary list',() => {
  it('contains the initial list header', () => {
    const { getByText } = render(<GlossaryList termMap={testGlossaryData2} />);

    expect(getByText('All Terms')).toBeInTheDocument();
  });

  it('renders a header for every letter containing a term', () => {
    const { getByText } = render(<GlossaryList termMap={testGlossaryData2} />);

    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('P')).toBeInTheDocument();
  });

  it('renders all terms for each given letter', () => {
    const { getByText } = render(<GlossaryList termMap={testGlossaryData2} />);

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Another Apple')).toBeInTheDocument();
    expect(getByText('Banana')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
  });

  it('applies a gradient to the scroll container when it is not at the top', () => {
    const { getByTestId } = render(<GlossaryList termMap={testGlossaryData2} />);

    expect(getByTestId('scrollGradient')).toHaveClass('scrollContainerTop');

    const scrollContainer = getByTestId('scrollContainer');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 100}})
    expect(getByTestId('scrollGradient')).toHaveClass('scrollGradient');
    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollContainerTop');

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 0}})
    expect(getByTestId('scrollGradient')).toHaveClass('scrollContainerTop');
    expect(getByTestId('scrollGradient')).not.toHaveClass('scrollGradient');
  })

  it('opens definition display on term click', () => {
    const { getByRole, getByText } = render(
      <GlossaryList termMap={testGlossaryData2} />
    );

    const termButton = getByRole('button', {name: 'Apple'});
    termButton.click();

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('An apple')).toBeInTheDocument();

  })

  it('definition display is keyboard accessible', () => {
    const { getByRole, getByText } = render(
      <GlossaryList termMap={testGlossaryData2} />
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

  it('renders a back to list button when a definition is displayed', () => {
    const { getByText, getByRole } = render(
      <GlossaryList termMap={testGlossaryData2} />
    );

    const termButton = getByText('Banana');
    termButton.click();

    const backButton = getByRole('button', {name: 'Back to list'});
    backButton.click();
  })

  it('initially display the default term definition', () => {
    const defaultTerm = testGlossaryData[0];
    const { getByText } = render(
      <GlossaryList termMap={testGlossaryData2} defaultTerm={defaultTerm} />
    );

    const {term, definition} = defaultTerm;


    expect(getByText(term)).toBeInTheDocument();
    expect(getByText(definition)).toBeInTheDocument();
  })

  it('filters terms and their headers with the provided search entry', () => {
    const { getByText, queryByText } = render(
      <GlossaryList termMap={testGlossaryData2} filter={'Pear'} />
    );

    expect(getByText('P')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
    expect(queryByText('A')).not.toBeInTheDocument();
    expect(queryByText('Apple')).not.toBeInTheDocument();
    expect(queryByText('All Terms')).not.toBeInTheDocument();
  })

  it('displays the full term list when the search filter is empty', () => {
    const { getByText } = render(
      <GlossaryList termMap={testGlossaryData2} filter={''} />
    );

    expect(getByText('All Terms')).toBeInTheDocument();
  })

  it('filters the list with the provided filter term', () => {
    const { getAllByText, queryByText } = render(
      <GlossaryList termMap={testGlossaryData2} filter={'apple'} />
    );

    expect(getAllByText('Apple')).toHaveLength(2);
    expect(queryByText('Banana')).toBeFalsy();
  })

  it('', () => {

  })

});
