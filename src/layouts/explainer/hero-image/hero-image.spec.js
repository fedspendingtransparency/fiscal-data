import React from 'react';
import { render } from "@testing-library/react";
import HeroImage from "./hero-image";

describe('Hero Image', () => {
  const heading = 'mock heading';
  const subHeading = 'mock sub-heading';
  const primaryColor = 'test';
  const secondaryColor = 'test';

  it('renders a section with a heading, sub-heading, and primary color', () => {
    const { getByText, getByTestId } = render(
      <HeroImage
        heading={heading}
        subHeading={subHeading}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        width={0}
      />
    );

    expect(getByText(heading)).toBeInTheDocument();
    expect(getByText(subHeading)).toBeInTheDocument();
    expect(getByTestId('main-container')).toHaveStyle({ backgroundColor: primaryColor });
    expect(getByTestId('hero-border')).toBeInTheDocument();
  })
})
