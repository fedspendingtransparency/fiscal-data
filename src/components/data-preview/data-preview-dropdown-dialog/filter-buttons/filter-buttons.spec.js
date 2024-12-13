import React from 'react';
import { render } from '@testing-library/react';
import FilterButtons from './filter-buttons';

describe('Data Preview Dropdown Dialog', () => {
  it('renders the dropdown', () => {
    const instance = render(<FilterButtons />);
    expect(instance).toBeDefined();
  });

  it('calls handleApply on button click', () => {
    const handleApplySpy = jest.fn();
    const { getByRole } = render(<FilterButtons handleApply={handleApplySpy} />);
    getByRole('button', { name: 'Apply' }).click();
    expect(handleApplySpy).toBeCalled();
  });

  it('calls handleCancel on button click', () => {
    const handleCancelSpy = jest.fn();
    const { getByRole } = render(<FilterButtons handleCancel={handleCancelSpy} />);
    getByRole('button', { name: 'Cancel' }).click();
    expect(handleCancelSpy).toBeCalled();
  });
});
