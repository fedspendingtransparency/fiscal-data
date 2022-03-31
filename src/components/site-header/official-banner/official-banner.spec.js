import React from 'react';
import { render } from "@testing-library/react";
import OfficialBanner from "./official-banner";

describe('OfficialBanner', () => {

  const officialText = 'An official website of the U.S. government';

  it('renders the containing div for the component', () => {
    const { getByTestId } = render(<OfficialBanner />);
    expect(getByTestId('officialBanner')).toBeDefined();
  });

  it('renders the div containing the text, with the correct text', () => {
    const { getByTestId, getByText, getByTitle } = render(<OfficialBanner />);
    expect(getByTestId('bannerText')).toBeDefined();
    expect(getByText(officialText)).toBeTruthy();
    expect(getByTitle('small flag')).toBeTruthy();
  });

  it('renders the div containing the flag img with alt text', () => {
    const { getByTestId, getByTitle } = render(<OfficialBanner />);
    expect(getByTestId('bannerImage')).toBeDefined();
    expect(getByTitle('small flag')).toBeDefined();
  });
});
