import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import BarGraph from './bar';
import { staggeredData } from '../helpers/helpersData';
import helpers from './helpers/helpers';

jest.mock('@nivo/bar', () => ({
  Bar: jest.fn(({ barComponent: BarComponent, data, indexBy, keys }) => {
    return (
      <div data-testid="mock-nivo-bar">
        {data.map((item, index) => (
          <div key={index}>{BarComponent && <BarComponent index={index} value={item[keys[0]]} data={item} />}</div>
        ))}
      </div>
    );
  }),
}));

jest.mock('./bar-component/bar-component', () => ({ index, value, handleTempValueChange }) => {
  return <button data-testid={`custom-bar-trigger-${index}`} onClick={() => handleTempValueChange(index, value)} />;
});

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
  const mouseEnterSpy = jest.spyOn(helpers, 'mouseEnterEvent');
  const mouseLeaveSpy = jest.spyOn(helpers, 'mouseLeaveEvent');

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

  beforeEach(() => {
    jest.clearAllMocks();
    // needed so mouseLeave executes callback
    mouseLeaveSpy.mockImplementation((cardId, callback) => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    });
  });

  it('triggers the mouseEnter and mouseLeave events', () => {
    jest.clearAllMocks();
    const { getByTestId } = render(<BarGraph {...barGraphProps} />);
    const chartContainer = getByTestId('barGraph');
    fireEvent.mouseEnter(chartContainer);
    expect(mouseEnterSpy).toHaveBeenCalledTimes(1);
    expect(mouseEnterPropSpy).toHaveBeenCalled();
    fireEvent.mouseLeave(chartContainer);
    expect(mouseLeaveSpy).toHaveBeenCalledTimes(1);
  });

  it('calls setTempValue and setTempDate with the correct values when the bar is clicked', async () => {
    const { getByTestId } = render(<BarGraph {...barGraphProps} />);
    const firstBar = getByTestId('custom-bar-trigger-0');
    fireEvent.click(firstBar);
    await waitFor(() => {
      expect(mockSetTempValue).toHaveBeenCalledWith('500');
      expect(mockSetTempDate).toHaveBeenCalledWith('2017');
    });
  });

  it('resets temp states when mouse leaves the bar', async () => {
    const { getByTestId } = render(<BarGraph {...barGraphProps} />);
    const chartContainer = getByTestId('barGraph');
    fireEvent.mouseLeave(chartContainer);
    expect(mouseLeaveSpy).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockSetTempValue).toHaveBeenCalledWith(null);
      expect(mockSetTempDate).toHaveBeenCalledWith(null);
    });
  });
});
