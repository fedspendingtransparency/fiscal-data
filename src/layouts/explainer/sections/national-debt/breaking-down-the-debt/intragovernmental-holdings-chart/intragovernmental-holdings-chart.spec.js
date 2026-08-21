import { render, act } from '@testing-library/react';
import React from 'react';
import IntragovernmentalHoldingsChart from './intragovernmental-holdings-chart';
import { nationalDebtSectionIds } from '../../national-debt';

let mockInView = true;

// the chart only mounts once it scrolls into view, observer needed to report visibility
jest.mock('react-intersection-observer', () => ({
  ...jest.requireActual('react-intersection-observer'),
  useInView: () => ({ ref: jest.fn(), inView: mockInView }),
}));

jest.mock('recharts', () => {
  const actualRecharts = jest.requireActual('recharts');
  const ReactActual = jest.requireActual('react');

  return {
    ...actualRecharts,
    ResponsiveContainer: ({ children, height }) =>
      ReactActual.cloneElement(children, { width: 800, height: typeof height === 'number' ? height : 400 }),
  };
});

const mockData = [
  {
    'Debt Held by the Public': 10.2560154323853,
    'Intragovernmental Holdings': 4.73769361275732,
    debt_held_public_mil_amt: '10256015.4323853',
    intragov_hold_mil_amt: '4737693.61275732',
    record_calendar_year: '2011',
    record_calendar_month: '10',
    record_date: '2011-10-31',
    total: '14.9',
  },
  {
    'Debt Held by the Public': 10.3899577807415,
    'Intragovernmental Holdings': 4.72054076767472,
    debt_held_public_mil_amt: '10389957.7807415',
    intragov_hold_mil_amt: '4720540.76767472',
    record_calendar_year: '2021',
    record_calendar_month: '10',
    record_date: '2021-10-31',
    total: '15.1',
  },
];

describe('Intragovernmental Holdings Chart', () => {
  const sectionId = nationalDebtSectionIds[4];

  beforeEach(() => {
    jest.useFakeTimers();
    mockInView = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // recharts holds labels back while a bar is animating, so let the entrance timer run out first
  const renderChart = () => {
    const utils = render(<IntragovernmentalHoldingsChart sectionId={sectionId} data={mockData} date={new Date()} />);

    act(() => {
      jest.runOnlyPendingTimers();
    });

    return utils;
  };

  it('renders the legend', () => {
    const { getByText } = renderChart();

    expect(getByText('Intragovernmental Holdings')).toBeInTheDocument();
    expect(getByText('Debt Held by the Public')).toBeInTheDocument();
  });

  it('orders the legend independently of the stacking order', () => {
    const { container } = renderChart();

    const legendLabels = [...container.querySelectorAll('.recharts-legend-wrapper li')].map(item => item.textContent);

    expect(legendLabels).toEqual(['Intragovernmental Holdings', 'Debt Held by the Public']);
  });

  it('renders a value label for each stacked segment', () => {
    const { getByText } = renderChart();

    // scoped to text nodes -- recharts wraps labels in a group whose text content matches too
    expect(getByText('$10.26 T', { selector: 'text' })).toBeInTheDocument();
    expect(getByText('$4.74 T', { selector: 'text' })).toBeInTheDocument();
    expect(getByText('$10.39 T', { selector: 'text' })).toBeInTheDocument();
    expect(getByText('$4.72 T', { selector: 'text' })).toBeInTheDocument();
  });

  it('anchors the earlier year labels left of the bars and the recent year labels right', () => {
    const { getByText } = renderChart();

    expect(getByText('$10.26 T', { selector: 'text' })).toHaveAttribute('text-anchor', 'end');
    expect(getByText('$4.74 T', { selector: 'text' })).toHaveAttribute('text-anchor', 'end');
    expect(getByText('$10.39 T', { selector: 'text' })).toHaveAttribute('text-anchor', 'start');
    expect(getByText('$4.72 T', { selector: 'text' })).toHaveAttribute('text-anchor', 'start');
  });

  it('renders the percent change callout', () => {
    const { getByTestId } = renderChart();
    expect(getByTestId('public-debt-increase')).toHaveTextContent('1');
    expect(getByTestId('govt-debt-increase')).toHaveTextContent('0');
  });

  it('holds the chart back until it scrolls into view', () => {
    mockInView = false;
    const { queryByText } = render(<IntragovernmentalHoldingsChart sectionId={sectionId} data={mockData} date={new Date()} />);
    expect(queryByText('$10.26 T', { selector: 'text' })).not.toBeInTheDocument();
    expect(queryByText('Intragovernmental Holdings')).not.toBeInTheDocument();
  });
});
