import React from "react";
import { render } from '@testing-library/react';
import LearnMoreSection from "./learn-more-section";


describe('Learn more section', () => {
  const mockResources = [
    {
      title: 'sample title',
      url: 'url'
    },
    {
      title: 'another title',
      url: 'url2'
    }
  ];

  const mockDescription = 'Test Description';

  it('renders the title and url for each specified resource', () => {
    const { getByText } = render(<LearnMoreSection links={mockResources} /> );
    expect(getByText('sample title')).toBeInTheDocument();
    expect(getByText('another title')).toBeInTheDocument();
    expect(getByText('url')).toBeInTheDocument();
    expect(getByText('url2')).toBeInTheDocument();
  });

  it('renders the description', () => {
    const { getByText } = render(
      <LearnMoreSection
        links={mockResources}
        description={mockDescription}
      /> );
    expect(getByText(mockDescription)).toBeInTheDocument();
  })
})
