import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingBondsKeyTakeaway from './savings-bonds-key-takeaway';

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <div></div>,
}));

describe('SavingBondsKeyTakeaway', () => {
  it('renders without crashing', () => {
    render(<SavingBondsKeyTakeaway />);
    expect(screen.getByText(/savings bonds are simple, safe, and affordable loans to the federal government/i)).toBeInTheDocument();
    expect(screen.getByText(/The level of investment in savings bonds has varied over the course of American history/i)).toBeInTheDocument();
    expect(screen.getByText(/savings bonds earn interest until they reach /i)).toBeInTheDocument();
  });
});
