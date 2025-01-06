import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LearnMore from './learn-more';

describe('Learn More Section', () => {
  it('renders the section', () => {
    render(<LearnMore />);
    expect(screen.getByText('Today, individuals can buy Series I and Series EE bonds online through', { exact: false })).toBeInTheDocument();
  });
});
