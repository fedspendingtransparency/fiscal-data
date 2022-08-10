import React from 'react';
import {render} from '@testing-library/react';
import ChartContainer from "./chart-container";


describe('Chart container component', () => {
  const mockTitle = 'Title';
  const mockFooter = 'Footer';
  const mockChart = <div>chart</div>
  const mockAltText = 'alt text';
  const mockDate = new Date('2021-09-30T00:00:00.000'); // prevent timezone adjustment

  it('renders the title', () => {
    const {getByText} = render(
      <ChartContainer
        title={mockTitle}
        footer={mockFooter}
        altText={mockAltText}
        date={mockDate}
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
        date={mockDate}
      >
        {mockChart}
      </ChartContainer>
    );
    expect(getByText(mockFooter, {exact: false})).toBeInTheDocument();
    expect(getByText('Last Updated:', {exact: false})).toBeInTheDocument();
    expect(getByText('September 30, 2021', {exact: false})).toBeInTheDocument();
  });

  it('renders the chart', () => {
    const {getByText, getByLabelText} = render(
      <ChartContainer
        title={mockTitle}
        footer={mockFooter}
        altText={mockAltText}
        date={mockDate}
      >
        {mockChart}
      </ChartContainer>
    );
    expect(getByText('chart')).toBeInTheDocument();
    expect(getByLabelText(mockAltText)).toBeInTheDocument();
  });


});



