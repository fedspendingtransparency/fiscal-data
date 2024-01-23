import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import OfficialBanner from './official-banner';

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

  it('renders the "Here\'s how you know" dropdown button', () => {
    const { getByRole } = render(<OfficialBanner />);
    const dropdownButton = getByRole('button', { name: "Here's how you know" });
    expect(dropdownButton).toBeInTheDocument();
  });

  it('renders the "Here\'s how you know" dropdown', () => {
    const { getByRole, getAllByRole, getByText } = render(<OfficialBanner />);
    const dropdownButton = getByRole('button', { name: "Here's how you know" });
    expect(dropdownButton).toBeInTheDocument();
    expect(getAllByRole('img', { hidden: true })[1]).toHaveClass('fa-chevron-down');
    fireEvent.click(dropdownButton);
    expect(getAllByRole('img', { hidden: true })[1]).toHaveClass('fa-chevron-up');
    expect(getByText('Official websites use .gov')).toBeInTheDocument();
    expect(getByText('Secure .gov websites use HTTPS')).toBeInTheDocument();
  });
  it('"Here\'s how you know" dropdown is keyboard accessible', () => {
    const { getByRole, getAllByRole, getByText } = render(<OfficialBanner />);
    const dropdownButton = getByRole('button', { name: "Here's how you know" });
    expect(dropdownButton).toBeInTheDocument();
    expect(getAllByRole('img', { hidden: true })[1]).toHaveClass('fa-chevron-down');
    fireEvent.keyDown(dropdownButton, { key: 'enter' });
    expect(getAllByRole('img', { hidden: true })[1]).toHaveClass('fa-chevron-up');
    expect(getByText('Official websites use .gov')).toBeInTheDocument();
    expect(getByText('Secure .gov websites use HTTPS')).toBeInTheDocument();
  });
});
