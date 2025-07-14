import React from 'react';
import { render, screen } from '@testing-library/react';
import NotShownMessage from './not-shown-message';

describe('NotShownMessage', () => {
  const testHeading = 'Use the dropdown to select a pivot option to display the chart.';
  const testBodyText = 'This data table cannot be rendered as a chart until a pivot option is applied.';

  beforeEach(() => {
    render(<NotShownMessage heading={testHeading} bodyText={testBodyText} />);
  });

  it('displays a container element which contains the component', () => {
    expect(screen.getByTestId('container')).toBeDefined();
  });

  it('displays the correct text, in two separate lines', () => {
    expect(screen.getByTestId('heading').textContent).toEqual(testHeading);
    expect(screen.getByTestId('bodyText').textContent).toEqual(testBodyText);
  });
});
