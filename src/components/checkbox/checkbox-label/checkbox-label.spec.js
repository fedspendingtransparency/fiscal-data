import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import CheckboxLabel from './checkbox-label';
import userEvent from '@testing-library/user-event';

describe('Checkbox component', () => {
  const mockCheckboxData = { label: 'Mock Option 1', value: 'one', filterCount: 4, active: true };

  it('contains a checkbox element with a label ', () => {
    const { getByRole } = render(<CheckboxLabel obj={mockCheckboxData} handleClick={jest.fn()} onHover={jest.fn()} index={0} />);
    const checkbox = getByRole('checkbox');
    expect(checkbox.name).toBe(mockCheckboxData.label);
  });

  it('should call onHover', () => {
    const onHoverSpy = jest.fn();
    const { getByRole } = render(<CheckboxLabel obj={mockCheckboxData} handleClick={jest.fn()} onHover={onHoverSpy} index={0} />);
    const checkbox = getByRole('checkbox');
    userEvent.hover(checkbox);
    expect(onHoverSpy).toHaveBeenCalledWith(true, mockCheckboxData);
    onHoverSpy.mockClear();
    userEvent.unhover(checkbox);
    expect(onHoverSpy).toHaveBeenCalledWith(false, mockCheckboxData);
  });

  it('should call handleClick on key down ', () => {
    const handleClickSpy = jest.fn();
    const { getByRole } = render(<CheckboxLabel obj={mockCheckboxData} handleClick={handleClickSpy} onHover={jest.fn()} index={0} />);
    const checkbox = getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(handleClickSpy).toHaveBeenCalled();
  });

  it('should apply color to container style', () => {
    const boxColor = '#123456';
    const { getByTestId } = render(
      <CheckboxLabel obj={mockCheckboxData} handleClick={jest.fn()} onHover={jest.fn()} index={0} boxColor={boxColor} />
    );
    const checkbox = getByTestId('checkboxLabelContainer');
    expect(checkbox).toHaveStyle({ borderColor: boxColor, backgroundColor: boxColor });
  });
});
