import React from 'react';
import VisualizationCallout from "./visualization-callout";
import { render } from "@testing-library/react";

describe('VisualizationCallout', () => {
    const exampleText = 'Test';
  it('renders children', () => {
    const { getByText } = render(<VisualizationCallout>{exampleText}</VisualizationCallout> );
    expect(getByText(exampleText)).toBeInTheDocument();
  })
})
