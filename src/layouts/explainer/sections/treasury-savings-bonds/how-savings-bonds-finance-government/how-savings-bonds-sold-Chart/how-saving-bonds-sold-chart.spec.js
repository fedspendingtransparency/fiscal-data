import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HowSavingsBondsSoldChart from './HowSavingsBondsSoldChart';
import { mockData01, mockData02 } from './how-savings-bond-sold-chart-test-helper'; 

describe('HowSavingsBondsSoldChart', () => {
  beforeEach(() => {
    render(<HowSavingsBondsSoldChart />);
  });

  it('renders pie chart with provided mock data', () => {
    expect(screen.getByTestId('chartParent')).toBeInTheDocument();
  });


});
