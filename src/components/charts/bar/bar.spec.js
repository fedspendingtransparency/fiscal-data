import React, { act } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import BarGraph from './bar';
import { staggeredData } from '../helpers/helpersData';
import userEvent from '@testing-library/user-event';

describe('BarGraph component', () => {
  it('does not render anything if invalid params are detected', () => {
    const { queryByTestId } = render(<BarGraph />);
    expect(queryByTestId('barGraph')).toBeNull();
  });

  it('renders a bar graph if valid params are detected', () => {
    const { queryByTestId } = render(<BarGraph graphData={staggeredData} graphIndex="year" valueKeys={['value']} />);
    expect(queryByTestId('barGraph')).toBeDefined();
  });
});

describe('BarGraph component - Custom bar graph', () => {
  const mouseEnterPropSpy = jest.fn();
  const mockSetTempValue = jest.fn();
  const mockSetTempDate = jest.fn();

  const barGraphProps = {
    graphData: staggeredData,
    graphIndex: 'year',
    valueKeys: ['value'],
    useCustomBarComponent: true,
    mouseEnter: mouseEnterPropSpy,
    setTempValue: mockSetTempValue,
    setTempDate: mockSetTempDate,
    dateField: 'year',
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers the mouseEnter and mouseLeave events', () => {
    jest.clearAllMocks();
    const { getByTestId } = render(<BarGraph {...barGraphProps} />);
    const chartContainer = getByTestId('barGraph');
    fireEvent.mouseEnter(chartContainer);
    expect(mouseEnterPropSpy).toHaveBeenCalled();
    fireEvent.mouseLeave(chartContainer);
    jest.runAllTimers();
    expect(mockSetTempValue).toHaveBeenCalledWith(null);
    expect(mockSetTempDate).toHaveBeenCalledWith(null);
  });

  it('tiggers events on keyboard interaction', async () => {
    jest.clearAllMocks();

    render(<BarGraph {...barGraphProps} />);
    act(() => {
      userEvent.tab();
    });
    await waitFor(() => {
      expect(mockSetTempValue).toHaveBeenCalledWith('500');
      expect(mockSetTempDate).toHaveBeenCalledWith('2017');
    });
  });
});
