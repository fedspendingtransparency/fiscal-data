import React from 'react';
import {render} from '@testing-library/react';
import ChartContainer from "./chart-container";


describe('Chart container component', () => {
  const mockTitle = 'Title';
  const mockFooter = 'Footer';
  const mockChart = <div>chart</div>
  const mockAltText = 'alt text';

  it('renders the title', () => {
    const {getByText} = render(
      <ChartContainer
        title={mockTitle}
        footer={mockFooter}
        altText={mockAltText}
      >
        {mockChart}
      </ChartContainer>
      );
    expect(getByText(mockTitle)).toBeInTheDocument();
  });

  it('renders the footer', () => {
    const {getByText} = render(
      <ChartContainer
        title={mockTitle}
        footer={mockFooter}
        altText={mockAltText}
      >
        {mockChart}
      </ChartContainer>
    );
    expect(getByText(mockFooter)).toBeInTheDocument();
  });

  it('renders the chart', () => {
    const {getByText, getByLabelText} = render(
      <ChartContainer
        title={mockTitle}
        footer={mockFooter}
        altText={mockAltText}
      >
        {mockChart}
      </ChartContainer>
    );
    expect(getByText('chart')).toBeInTheDocument();
    expect(getByLabelText(mockAltText)).toBeInTheDocument();
  });


});



