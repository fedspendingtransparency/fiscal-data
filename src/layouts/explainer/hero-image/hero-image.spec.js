import React from 'react';
import { render } from "@testing-library/react";
import HeroImage from "./hero-image";
import NationalDebtHero from "../heros/national-debt/national-debt-hero";
import { setGlobalFetchResponse } from "../../../utils/mock-utils";
import { mockExplainerPageResponse } from "../explainer-test-helper";

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
describe('National Debt Hero', () => {
  beforeEach(() => {
    setGlobalFetchResponse(jest, mockExplainerPageResponse);
  });

  it('renders a callout section on the national debt explainer page', async () => {
    const heading = 'mock heading';
    const subHeading = 'mock sub-heading';
    const primaryColor = 'test';
    const secondaryColor = 'test';
    const children = <NationalDebtHero />

    const { getAllByRole, getByTestId } = render(
      <HeroImage
        heading={heading}
        subHeading={subHeading}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        width={0}
        children={children}
      />
    );

    const flagIcon = getAllByRole('img', {hidden:true}, {name:"flag-usa"});

    expect(getByTestId('nationalDebtCallout')).toBeInTheDocument();
    expect(flagIcon).toHaveLength(1);
    expect(flagIcon[0]).toBeInTheDocument();
  })
})
