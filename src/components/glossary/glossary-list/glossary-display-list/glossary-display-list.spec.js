import { render } from '@testing-library/react';
import { testSortedGlossaryData } from '../../test-helper';
import GlossaryDisplayList from './glossary-display-list';
import React from 'react';


describe('glossary display list', () => {
  const mockSectionTermHandler = jest.fn();
  it('renders a header for every letter containing a term', () => {
    const { getByText } = render(
      <GlossaryDisplayList sortedList={testSortedGlossaryData} filter={''} selectedTermHandler={mockSectionTermHandler} />
    );

    expect(getByText('A')).toBeInTheDocument();
    expect(getByText('B')).toBeInTheDocument();
    expect(getByText('P')).toBeInTheDocument();
  });

  it('renders all terms for each given letter', () => {
    const { getByText } = render(
      <GlossaryDisplayList sortedList={testSortedGlossaryData} filter={''} selectedTermHandler={mockSectionTermHandler} />
    );

    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Another Apple')).toBeInTheDocument();
    expect(getByText('Banana')).toBeInTheDocument();
    expect(getByText('Pear')).toBeInTheDocument();
  });

  it('underlines the substring that matches the filter', () => {

  })
})
