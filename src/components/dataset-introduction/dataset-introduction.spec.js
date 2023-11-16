import React from 'react';
import DatasetIntroduction from './dataset-introduction';
import { render } from '@testing-library/react';

describe('DatasetIntroduction', () => {
  const summaryText = 'This is the summary text.';
  const dictionary = 1;
  it('renders a dataset introduction', () => {
    const { getByText } = render(<DatasetIntroduction summaryText={summaryText} techSpecs={{}} dictionary={dictionary} />);
    expect(getByText('Introduction')).toBeInTheDocument();
  });

  it('renders pills', () => {
    const { getByTestId } = render(<DatasetIntroduction summaryText={summaryText} techSpecs={{}} dictionary={dictionary} />);
    expect(getByTestId('detailPills')).toBeInTheDocument();
  });

  it('renders a dataset description', () => {
    const { getByText } = render(<DatasetIntroduction summaryText={summaryText} techSpecs={{}} dictionary={dictionary} />);
    expect(getByText(summaryText)).toBeInTheDocument();
  });
});
