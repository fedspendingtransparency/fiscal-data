import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import CustomSlices from './custom-slice';

describe('Custom slice', () => {
  const mockSetCurrentSlice = jest.fn();
  const mockGroupMouseLeave = jest.fn();
  const mockMouseMove = jest.fn();
  const mockSlices = [{ x0: 1, y0: 1, width: 1, height: 1 }];

  it('Renders the custom slices', () => {
    const { getByTestId } = render(
      <CustomSlices
        slices={mockSlices}
        data={[]}
        setCurrentSlice={mockSetCurrentSlice}
        groupMouseLeave={mockGroupMouseLeave}
        mouseMove={mockMouseMove}
        inView={false}
        duration={1000}
      />
    );
    expect(getByTestId('customSlices')).toBeInTheDocument();
  });

  it('calls group mouse handlers', () => {
    const { getByTestId } = render(
      <CustomSlices
        slices={mockSlices}
        data={[]}
        setCurrentSlice={mockSetCurrentSlice}
        groupMouseLeave={mockGroupMouseLeave}
        mouseMove={mockMouseMove}
        inView={false}
        duration={1000}
      />
    );
    const slices = getByTestId('customSlices');
    fireEvent.mouseLeave(slices);
    expect(mockGroupMouseLeave).toHaveBeenCalled();
  });

  it('calls slice mouse handlers', () => {
    const { getAllByTestId } = render(
      <CustomSlices
        slices={mockSlices}
        data={[]}
        setCurrentSlice={mockSetCurrentSlice}
        groupMouseLeave={mockGroupMouseLeave}
        mouseMove={mockMouseMove}
        inView={false}
        duration={1000}
      />
    );
    const slice = getAllByTestId('customSlice')[0];
    fireEvent.mouseEnter(slice);
    expect(mockSetCurrentSlice).toHaveBeenCalledWith(mockSlices[0]);

    fireEvent.mouseMove(slice);
    expect(mockMouseMove).toHaveBeenCalled();

    fireEvent.mouseLeave(slice);
    expect(mockSetCurrentSlice).toHaveBeenCalledWith(null);

    fireEvent.focus(slice);
    expect(mockMouseMove).toHaveBeenCalled();
  });
});
